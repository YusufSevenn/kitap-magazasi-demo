import{Column, Entity, PrimaryGeneratedColumn} from 'typeorm';
@Entity() 
    export class Book{
        @PrimaryGeneratedColumn()
        id: number;

        @Column()
        title: string;

        @Column()
        author: string;

        @Column()
        price: number;

        @Column()
        imageUrl: string;

        @Column({default : 0})
        salesCount: number;

        @Column({default: false})
        isDefault: boolean;
    }