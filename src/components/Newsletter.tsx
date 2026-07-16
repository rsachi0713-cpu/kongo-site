export default function Newsletter() {
  return (
    <section className="py-[120px] px-5 md:px-16 max-w-3xl mx-auto text-center animate-fade-in-up">
      <span className="material-symbols-outlined text-4xl mb-6 text-[#D4AF37]">drafts</span>
      <h2 className="font-poppins text-2xl font-medium text-black mb-4">Join the List</h2>
      <p className="font-inter text-base text-gray-500 mb-8">
        Subscribe to receive updates, access to exclusive deals, and more.
      </p>
      <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
        <input 
          className="flex-1 bg-transparent border-b border-gray-300 py-3 px-2 font-inter text-base text-black placeholder:text-gray-400 focus:outline-none focus:border-black transition-colors" 
          placeholder="Enter your email address" 
          required 
          type="email"
        />
        <button 
          className="bg-black text-white px-8 py-3 rounded font-inter text-sm uppercase tracking-wider hover:opacity-90 transition-opacity whitespace-nowrap font-medium" 
          type="submit"
        >
          Subscribe
        </button>
      </form>
    </section>
  );
}
