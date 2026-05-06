import React, { useEffect, useState } from 'react';
import { getBooks, resetDatabase, deleteBook, createBook, updateBook } from '../api/apiService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AdminPage = () => {
  const [books, setBooks] = useState([]);
  const [formData, setFormData] = useState({ title: '', author: '', price: '', imageUrl: '', salesCount: 0 });
  const [editingId, setEditingId] = useState(null);

  const fetchBooks = async () => {
    const response = await getBooks();
    setBooks(response.data);
  };

  useEffect(() => { fetchBooks(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { ...formData, price: Number(formData.price), salesCount: Number(formData.salesCount) };
      if (editingId) {
        await updateBook(editingId, data);
        alert("Kitap başarıyla güncellendi!");
      } else {
        await createBook({ ...data, isDefault: false });
        alert("Yeni kitap başarıyla eklendi!");
      }
      handleCancel();
      fetchBooks();
    } catch (error) {
      alert("İşlem sırasında hata oluştu.");
    }
  };

  const handleEdit = (book) => {
    setEditingId(book.id);
    setFormData({
      title: book.title,
      author: book.author,
      price: book.price,
      imageUrl: book.imageUrl,
      salesCount: book.salesCount
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({ title: '', author: '', price: '', imageUrl: '', salesCount: 0 });
  };

  const handleReset = async () => {
    if (window.confirm("Sistemi sıfırlamak istediğinize emin misiniz?")) {
      await resetDatabase();
      fetchBooks();
      handleCancel();
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen pb-24">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Yönetim Paneli</h1>
          <button onClick={() => window.location.href = '/'} className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors">← Siteye Dön</button>
        </div>

        {/* 1. FORM BÖLÜMÜ */}
        <div className={`p-6 rounded-xl shadow-sm mb-8 transition-all ${editingId ? 'bg-blue-50 border-2 border-blue-200' : 'bg-white'}`}>
          <h2 className="text-lg font-semibold mb-4 border-b pb-2">
            {editingId ? "Kitabı Düzenle" : "Yeni Kitap Ekle"}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <input type="text" placeholder="Kitap Adı" className="border p-2 rounded" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required />
            <input type="text" placeholder="Yazar" className="border p-2 rounded" value={formData.author} onChange={(e) => setFormData({...formData, author: e.target.value})} required />
            <input type="number" placeholder="Fiyat" className="border p-2 rounded" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} required />
            <input type="text" placeholder="Görsel URL" className="border p-2 rounded" value={formData.imageUrl} onChange={(e) => setFormData({...formData, imageUrl: e.target.value})} />
            <div className="flex gap-2">
              <button type="submit" className={`flex-1 text-white p-2 rounded font-medium ${editingId ? 'bg-blue-600' : 'bg-green-600'}`}>
                {editingId ? "Güncelle" : "Ekle"}
              </button>
              {editingId && (
                <button type="button" onClick={handleCancel} className="bg-gray-400 text-white px-3 rounded">İptal</button>
              )}
            </div>
          </form>
        </div>

        {/* 2. GRAFİK BÖLÜMÜ (Geri Geldi!) */}
        <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
          <h2 className="text-lg font-semibold mb-4">Satış Grafiği</h2>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={books}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="title" tick={{fontSize: 12}} />
                <YAxis />
                <Tooltip cursor={{fill: '#f3f4f6'}} />
                <Bar dataKey="salesCount" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Satış Adedi" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. TABLO BÖLÜMÜ */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-100 font-semibold text-gray-700">
              <tr>
                <th className="p-4">Kitap</th>
                <th className="p-4">Yazar</th>
                <th className="p-4">Satış</th>
                <th className="p-4">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {books.map(book => (
                <tr key={book.id} className="border-t hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-medium text-gray-800">
                    {book.title} 
                    {book.isDefault && <span className="ml-2 text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">Varsayılan</span>}
                  </td>
                  <td className="p-4 text-gray-600">{book.author}</td>
                  <td className="p-4 font-semibold text-blue-600">{book.salesCount}</td>
                  <td className="p-4 flex gap-4">
                    <button onClick={() => handleEdit(book)} className="text-blue-500 hover:text-blue-700 font-medium">Düzenle</button>
                    <button onClick={() => deleteBook(book.id).then(fetchBooks)} className="text-red-500 hover:text-red-700 font-medium">Sil</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SİHİRLİ RESET BUTONU */}
      <button 
        onClick={handleReset} 
        className="fixed bottom-8 right-8 bg-red-600 hover:bg-red-700 text-white w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 group z-50"
      >
        <span className="absolute right-20 bg-gray-800 text-white px-3 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Sistemi Sıfırla</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </button>
    </div>
  );
};

export default AdminPage;