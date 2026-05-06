import React, { useEffect, useState } from 'react';
import { getBooks, purchaseBook } from '../api/apiService';
import BookCard from '../components/BookCard';

const HomePage = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Verileri Backend'den çek
  const fetchBooks = async () => {
    try {
      const response = await getBooks();
      setBooks(response.data);
    } catch (error) {
      console.error("Kitaplar yüklenirken hata oluştu:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // Satın alma işlemi
  const handlePurchase = async (id) => {
    try {
      await purchaseBook(id);
      alert("Kitap başarıyla satın alındı!");
      fetchBooks(); // Listeyi güncelle (salesCount arttığını görmek için)
    } catch (error) {
      alert("Satın alma işlemi başarısız.");
    }
  };

  if (loading) return <div className="text-center mt-20">Yükleniyor...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="flex justify-between items-center mb-8 border-b pb-4">
        <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">
          Kitap<span className="text-blue-600">Evi</span> Online
        </h1>
        <button 
          onClick={() => window.location.href = '/admin'} 
          className="text-gray-500 hover:text-blue-600 text-sm font-medium"
        >
          Admin Paneli →
        </button>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {books.map(book => (
          <BookCard key={book.id} book={book} onPurchase={handlePurchase} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;