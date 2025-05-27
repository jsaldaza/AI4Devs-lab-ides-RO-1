import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Candidate } from './Candidate';

@Entity('documents')
export class Document {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    fileName!: string;

    @Column()
    originalName!: string;

    @Column()
    mimeType!: string;

    @Column()
    path!: string;

    @Column()
    size!: number;

    @Column()
    type!: 'CV' | 'OTHER';

    @ManyToOne(() => Candidate, candidate => candidate.documents, {
        onDelete: 'CASCADE'
    })
    candidate!: Candidate;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
} 