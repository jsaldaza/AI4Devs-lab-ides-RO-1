import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Candidate } from './Candidate';

@Entity('education')
export class Education {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    institution!: string;

    @Column()
    degree!: string;

    @Column()
    fieldOfStudy!: string;

    @Column()
    startDate!: Date;

    @Column({ nullable: true })
    endDate?: Date;

    @Column({ default: false })
    isCurrentlyStudying!: boolean;

    @Column({ nullable: true })
    description?: string;

    @ManyToOne(() => Candidate, candidate => candidate.education, {
        onDelete: 'CASCADE'
    })
    candidate!: Candidate;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
} 