import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './entities/book.entity'; // 'src/books/...' yerine relatif yol daha güvenlidir

@Injectable()
export class BooksService implements OnModuleInit {
  constructor(
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
  ) {}

  // Uygulama ayağa kalktığında çalışır
  async onModuleInit() {
    const count = await this.bookRepository.count();
    if (count === 0) {
      await this.resetDatabase();
    }
  }

  // Adminin tetikleyeceği reset mekanizması
  async resetDatabase() {
    const defaultBooks = [
      { id: 1, title: 'Nutuk', author: 'Mustafa Kemal Atatürk', price: 120, imageUrl: 'Nutuk.png.webp', salesCount: 45, isDefault: true },
      { id: 2, title: 'Dorian Gray’in Portresi', author: 'Oscar Wilde', price: 200, imageUrl: 'dorian grayin portresi.jpeg', salesCount: 17, isDefault: true },
      { id: 3, title: 'İki Şehrin Hikayesi', author: 'Charles Dickens', price: 175, imageUrl: 'iki şehrin hikayesi.jpg', salesCount: 22, isDefault: true },
      { id: 4, title: 'Faust', author: 'Goethe', price: 100, imageUrl: 'faust.jpg', salesCount: 13, isDefault: true },
      { id: 5, title: 'Kaşağı', author: 'Ömer Seyfettin', price: 50, imageUrl: 'kaşağı.jpeg', salesCount: 50, isDefault: true },
      { id: 6, title: 'Şu Çılgın Türkler', author: 'Turgut Özakman', price: 125, imageUrl: 'ah su cilgin turkler.jpg', salesCount: 70, isDefault: true },
    ];

    // 1. Sonradan eklenenleri sil
    await this.bookRepository.delete({ isDefault: false });

    // 2. Varsayılanları güncelle veya yeniden oluştur
    for (const bookData of defaultBooks) {
      await this.bookRepository.save(bookData);
    }

    return { message: 'Sistem başarıyla sıfırlandı!' };
  }

  // Satın alma mantığı
  async purchase(id: number) {
    const book = await this.bookRepository.findOneBy({ id });
    if (book) {
      book.salesCount += 1;
      return this.bookRepository.save(book);
    }
  }

  // Standart CRUD Metodları
  async findAll(): Promise<Book[]> {
    return this.bookRepository.find();
  }

  async create(bookData: Partial<Book>): Promise<Book> {
    const newBook = this.bookRepository.create({
      ...bookData,
      isDefault: false,
    });
    return this.bookRepository.save(newBook);
  }

  async update(id: number, updateData: Partial<Book>): Promise<Book> {
    await this.bookRepository.update(id, updateData);
    const updatedBook = await this.bookRepository.findOneBy({ id });
    if (!updatedBook) throw new Error('Kitap bulunamadı');
    return updatedBook;
  }

  async remove(id: number): Promise<void> {
    await this.bookRepository.delete(id);
  }
}