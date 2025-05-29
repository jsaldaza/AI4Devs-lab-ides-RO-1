import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Candidate } from './Candidate';

@Entity('work_experience')
export class WorkExperience {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    company!: string;

    @Column()
    position!: string;

    @Column()
    startDate!: Date;

    @Column({ nullable: true })
    endDate?: Date;

    @Column({ default: false })
    isCurrentJob!: boolean;

    @Column({ nullable: true })
    description?: string;

    @Column('simple-array', { nullable: true })
    technologies?: string[];

    @Column({ nullable: true })
    achievements?: string;

    @ManyToOne(() => Candidate, candidate => candidate.workExperience, {
        onDelete: 'CASCADE'
    })
    candidate!: Candidate;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
} 