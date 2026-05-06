import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BooksModule } from './books/books.module';
import { Book } from 'src/books/entities/book.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite', // Proje kökünde bu isimle bir dosya oluşacak
      entities: [Book],
      synchronize: true, // Geliştirme aşamasında tabloları otomatik oluşturur
    }),
    BooksModule,
  ],
})
export class AppModule {}