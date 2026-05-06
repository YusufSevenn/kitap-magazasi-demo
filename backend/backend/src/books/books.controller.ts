import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BooksService } from './books.service';
import { Book } from './entities/book.entity';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  // 1. Tüm kitapları listele (Hem Admin hem Kullanıcı kullanacak)
  @Get()
  findAll() {
    return this.booksService.findAll(); // Tüm kitapları döner
  }

  // 2. Yeni kitap ekle (Sadece Admin - isDefault otomatik false olacak)
  @Post()
  create(@Body() bookData: Partial<Book>) {
    return this.booksService.create({ ...bookData, isDefault: false });
  }

  // 3. Kitap Güncelle (Admin)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateData: Partial<Book>) {
    return this.booksService.update(+id, updateData);
  }

  // 4. Kitap Sil (Admin)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.booksService.remove(+id);
  }

  // 5. Satın Alma İşlemi (Kullanıcı)
  // Bu rota tetiklendiğinde ilgili kitabın salesCount değeri 1 artacak
  @Post('purchase/:id')
  purchase(@Param('id') id: string) {
    return this.booksService.purchase(+id);
  }

  // 6. SIHIRLI RESET BUTONU
  // Admin panelindeki butona basıldığında bu rota çalışacak
  @Post('reset')
  reset() {
    return this.booksService.resetDatabase();
  }
}