import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Education } from './Education';
import { WorkExperience } from './WorkExperience';
import { Document } from './Document';

@Entity('candidate')
export class Candidate {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    firstName!: string;

    @Column()
    lastName!: string;

    @Column({ unique: true })
    email!: string;

    @Column()
    phone!: string;

    @Column({ nullable: true })
    address?: string;

    @Column('simple-array', { nullable: true })
    technicalSkills?: string[];

    @Column('int', { default: 0 })
    yearsOfExperience!: number;

    @Column({ nullable: true })
    currentPosition?: string;

    @Column({ nullable: true })
    preferredRole?: string;

    @Column({ nullable: true })
    cvFileUrl?: string;

    @Column({ default: true })
    isActive!: boolean;

    @Column({ type: 'timestamp', nullable: true })
    dataRetentionDate?: Date;

    @OneToMany(() => Education, education => education.candidate, {
        cascade: true,
        eager: true
    })
    education!: Education[];

    @OneToMany(() => WorkExperience, workExperience => workExperience.candidate, {
        cascade: true,
        eager: true
    })
    workExperience!: WorkExperience[];

    @OneToMany(() => Document, document => document.candidate, {
        cascade: true,
        eager: true
    })
    documents!: Document[];

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
} 