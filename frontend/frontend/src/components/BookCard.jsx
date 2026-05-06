import React from 'react';

const BookCard = ({ book, onPurchase }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
     <img 
  src={`/${book.imageUrl}`} 
  alt={book.title} 
  className="w-full h-64 object-cover"
  onError={(e) => { e.target.src = 'https://via.placeholder.com/200x300?text=Resim+Yok'; }}
/>
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-800 truncate">{book.title}</h3>
        <p className="text-sm text-gray-600 mb-2">{book.author}</p>
        <div className="flex justify-between items-center mt-4">
          <span className="text-xl font-semibold text-blue-600">{book.price} TL</span>
          <button 
            onClick={() => onPurchase(book.id)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
          >
            Satın Al
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookCard;