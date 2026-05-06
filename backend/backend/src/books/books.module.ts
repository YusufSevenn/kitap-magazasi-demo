import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { Book } from './entities/book.entity';

@Module({
  imports: [
    // Book entity'sini bu modülde kullanabilmek için register ediyoruz
    TypeOrmModule.forFeature([Book])
  ],
  controllers: [BooksController],
  providers: [BooksService],
  // Eğer başka modüller bu servise ihtiyaç duyarsa diye dışarı açıyoruz
  exports: [BooksService] 
})
export class BooksModule {}