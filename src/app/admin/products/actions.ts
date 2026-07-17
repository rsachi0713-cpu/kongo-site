'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function addProduct(formData: FormData) {
  const supabase = await createClient()

  // Extract form data
  const name = formData.get('name') as string
  const category = formData.get('category') as string
  const priceStr = formData.get('price') as string
  const stockStr = formData.get('stock') as string
  const status = formData.get('status') as string
  const imageUrl = formData.get('imageUrl') as string
  const description = formData.get('description') as string
  const imageFiles = formData.getAll('imageFiles') as File[]

  // Parse numbers
  const mainPrice = parseFloat(priceStr)
  const stock = parseInt(stockStr, 10)

  // Parse offer promotion details
  const isOffer = formData.get('isOffer') === 'on'
  const offerPriceStr = formData.get('offerPrice') as string
  const offerEndDate = formData.get('offerEndDate') as string

  const offerPrice = isOffer && offerPriceStr ? parseFloat(offerPriceStr) : null
  const finalPrice = isOffer && offerPrice !== null ? offerPrice : mainPrice
  const originalPrice = isOffer ? mainPrice : null
  const discountPercent = isOffer && originalPrice && finalPrice && originalPrice > finalPrice
    ? Math.round(((originalPrice - finalPrice) / originalPrice) * 100)
    : 0
  const finalEndDate = isOffer && offerEndDate ? new Date(offerEndDate).toISOString() : null

  const uploadedUrls: string[] = []

  // Upload all selected image files to storage
  for (const file of imageFiles) {
    if (file && file.size > 0) {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, file)

      if (!uploadError) {
        const { data } = supabase.storage.from('product-images').getPublicUrl(fileName)
        uploadedUrls.push(data.publicUrl)
      }
    }
  }

  // Combine uploaded file URLs with any manually pasted URL
  const images = [...uploadedUrls]
  if (imageUrl) {
    images.push(imageUrl)
  }

  const finalImageUrl = images[0] || null

  // Insert into database
  const { error } = await supabase.from('products').insert({
    name,
    category,
    price: finalPrice,
    stock,
    status,
    image_url: finalImageUrl,
    images: images,
    description: description || null,
    is_offer: isOffer,
    discount_percent: discountPercent,
    offer_end_date: finalEndDate,
    original_price: originalPrice
  })

  if (error) {
    return redirect(`/admin/products/new?error=${encodeURIComponent(error.message)}`)
  }

  // Revalidate caches to show the new product instantly
  revalidatePath('/admin/products')
  revalidatePath('/shop')
  revalidatePath('/')

  // Redirect back to the products list
  redirect('/admin/products')
}

export async function deleteProduct(formData: FormData) {
  const supabase = await createClient()
  const id = formData.get('id') as string

  if (!id) {
    return redirect('/admin/products')
  }

  // Fetch product to get all its images before deleting
  const { data: product } = await supabase
    .from('products')
    .select('images')
    .eq('id', id)
    .single()

  // Delete all uploaded images from Supabase Storage
  if (product?.images && Array.isArray(product.images)) {
    const fileNamesToDelete = product.images
      .filter((url: string) => url.includes('/storage/v1/object/public/product-images/'))
      .map((url: string) => url.split('/product-images/').pop())
      .filter(Boolean) as string[]

    if (fileNamesToDelete.length > 0) {
      await supabase.storage.from('product-images').remove(fileNamesToDelete)
    }
  }

  const { error } = await supabase.from('products').delete().eq('id', id)

  if (error) {
    return redirect(`/admin/products?error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/admin/products')
  revalidatePath('/shop')
  revalidatePath('/')

  redirect('/admin/products')
}

export async function editProduct(formData: FormData) {
  const supabase = await createClient()

  const id = formData.get('id') as string
  const name = formData.get('name') as string
  const category = formData.get('category') as string
  const priceStr = formData.get('price') as string
  const stockStr = formData.get('stock') as string
  const status = formData.get('status') as string
  const imageUrl = formData.get('imageUrl') as string
  const description = formData.get('description') as string
  const imageFiles = formData.getAll('imageFiles') as File[]
  
  // Interactive list of remaining images from the Client ImagePreview component
  const remainingImagesJson = formData.get('remainingImages') as string
  let remainingImages: string[] = []
  try {
    const parsed = remainingImagesJson ? JSON.parse(remainingImagesJson) : []
    remainingImages = Array.isArray(parsed) ? parsed : []
  } catch {
    remainingImages = []
  }

  if (!id) {
    return redirect('/admin/products')
  }

  const mainPrice = parseFloat(priceStr)
  const stock = parseInt(stockStr, 10)

  // Parse offer promotion details
  const isOffer = formData.get('isOffer') === 'on'
  const offerPriceStr = formData.get('offerPrice') as string
  const offerEndDate = formData.get('offerEndDate') as string

  const offerPrice = isOffer && offerPriceStr ? parseFloat(offerPriceStr) : null
  const finalPrice = isOffer && offerPrice !== null ? offerPrice : mainPrice
  const originalPrice = isOffer ? mainPrice : null
  const discountPercent = isOffer && originalPrice && finalPrice && originalPrice > finalPrice
    ? Math.round(((originalPrice - finalPrice) / originalPrice) * 100)
    : 0
  const finalEndDate = isOffer && offerEndDate ? new Date(offerEndDate).toISOString() : null

  // 1. Fetch current database record to find which images were deleted
  const { data: dbProduct } = await supabase
    .from('products')
    .select('images')
    .eq('id', id)
    .single()

  const currentImagesList = dbProduct?.images || []

  // 2. Identify and delete removed files from Storage
  const deletedImages = currentImagesList.filter((url: string) => !remainingImages.includes(url))
  const fileNamesToDelete = deletedImages
    .filter((url: string) => url.includes('/storage/v1/object/public/product-images/'))
    .map((url: string) => url.split('/product-images/').pop())
    .filter(Boolean) as string[]

  if (fileNamesToDelete.length > 0) {
    await supabase.storage.from('product-images').remove(fileNamesToDelete)
  }

  // 3. Upload new files
  const uploadedUrls: string[] = []
  for (const file of imageFiles) {
    if (file && file.size > 0) {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, file)

      if (!uploadError) {
        const { data } = supabase.storage.from('product-images').getPublicUrl(fileName)
        uploadedUrls.push(data.publicUrl)
      }
    }
  }

  // 4. Combine remaining images with new uploads and new URLs
  const newUrls = [...uploadedUrls]
  if (imageUrl) {
    newUrls.push(imageUrl)
  }

  const finalImages = [...remainingImages, ...newUrls]
  const finalImageUrl = finalImages[0] || null

  // 5. Update database
  const { error } = await supabase
    .from('products')
    .update({
      name,
      category,
      price: finalPrice,
      stock,
      status,
      image_url: finalImageUrl,
      images: finalImages,
      description: description || null,
      is_offer: isOffer,
      discount_percent: discountPercent,
      offer_end_date: finalEndDate,
      original_price: originalPrice
    })
    .eq('id', id)

  if (error) {
    return redirect(`/admin/products/${id}/edit?error=${encodeURIComponent(error.message)}`)
  }

  // Revalidate caches to show updates instantly
  revalidatePath('/admin/products')
  revalidatePath('/shop')
  revalidatePath('/')

  // Redirect back to the products list
  redirect('/admin/products')
}
