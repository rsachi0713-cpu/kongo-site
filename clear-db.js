const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://gapcihekbovyioiamqmf.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdhcGNpaGVrYm92eWlvaWFtcW1mIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDE4Mzc4NywiZXhwIjoyMDk5NzU5Nzg3fQ.pfasDbPj24ZdWlB7fWvKtlZurMy2VOjqMbl6M3UenQs');

async function clearDb() {
  console.log('Clearing database...');
  
  // 1. Delete all orders
  const { error: errOrders } = await supabase.from('orders').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  console.log('Orders cleared', errOrders);
  
  // 2. Delete all cart items
  const { error: errCart } = await supabase.from('cart_items').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  console.log('Cart items cleared', errCart);

  // 3. Delete all wishlist items
  const { error: errWishlist } = await supabase.from('wishlist').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  console.log('Wishlist cleared', errWishlist);
  
  // 4. Delete all products
  const { error: errProducts } = await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  console.log('Products cleared', errProducts);
  
  // 5. Delete all auth users (this will cascade to profiles usually, but let's do it via admin api)
  const { data: usersData, error: usersErr } = await supabase.auth.admin.listUsers();
  if (usersData?.users) {
    for (const u of usersData.users) {
      await supabase.auth.admin.deleteUser(u.id);
    }
    console.log('Deleted ' + usersData.users.length + ' users from auth.');
  } else {
    console.log('Error fetching users:', usersErr);
  }
  
  // 6. Delete profiles explicitly just in case
  const { error: errProfiles } = await supabase.from('profiles').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  console.log('Profiles cleared', errProfiles);

  // 7. Clear product-images bucket, EXCEPT banners
  const banners = ['1784255128217-c2uge.png', '1784255135750-56psce.png'];
  const { data: files } = await supabase.storage.from('product-images').list();
  if (files) {
    const filesToDelete = files.filter(f => !banners.includes(f.name) && f.name !== '.emptyFolderPlaceholder').map(f => f.name);
    if (filesToDelete.length > 0) {
      await supabase.storage.from('product-images').remove(filesToDelete);
      console.log('Deleted ' + filesToDelete.length + ' images from storage.');
    }
  }

  console.log('Database cleared completely (except banners)!');
}

clearDb();
