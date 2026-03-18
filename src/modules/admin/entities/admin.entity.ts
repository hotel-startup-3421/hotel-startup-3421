// src/modules/admin/entities/admin.entity.ts
import { 
    Entity, 
    Column, 
    PrimaryGeneratedColumn, 
    CreateDateColumn, 
    UpdateDateColumn,
    OneToMany,
    BeforeInsert,
    BeforeUpdate
} from 'typeorm';
import { Exclude } from 'class-transformer';
import * as bcrypt from 'bcrypt';

export enum AdminRole {
    SUPER_ADMIN = 'super_admin',
    ADMIN = 'admin',
    MODERATOR = 'moderator',
    SUPPORT = 'support'
}

export enum AdminStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    SUSPENDED = 'suspended',
    PENDING = 'pending'
}

@Entity('admins')
export class Admin {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 100 })
    firstName: string;

    @Column({ length: 100 })
    lastName: string;

    @Column({ unique: true, length: 100 })
    email: string;

    @Column({ unique: true, length: 50, nullable: true })
    username: string;

    @Exclude()
    @Column()
    password: string;

    @Column({
        type: 'enum',
        enum: AdminRole,
        default: AdminRole.ADMIN
    })
    role: AdminRole;

    @Column({
        type: 'enum',
        enum: AdminStatus,
        default: AdminStatus.PENDING
    })
    status: AdminStatus;

    @Column({ nullable: true })
    avatar: string;

    @Column({ nullable: true })
    phoneNumber: string;

    @Column({ type: 'jsonb', nullable: true })
    permissions: {
        hotels?: boolean;
        guides?: boolean;
        bookings?: boolean;
        users?: boolean;
        payments?: boolean;
        reports?: boolean;
        settings?: boolean;
    };

    @Column({ default: false })
    isEmailVerified: boolean;

    @Column({ nullable: true })
    lastLoginAt: Date;

    @Column({ nullable: true })
    lastLoginIp: string;

    @Column({ type: 'simple-array', nullable: true })
    refreshTokens: string[];

    @Column({ type: 'jsonb', nullable: true })
    metadata: {
        department?: string;
        position?: string;
        employeeId?: string;
        notes?: string;
    };

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column({ nullable: true })
    deletedAt: Date;

    // Virtual field for full name
    get fullName(): string {
        return `${this.firstName} ${this.lastName}`;
    }

    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword() {
        if (this.password) {
            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password, salt);
        }
    }

    async validatePassword(password: string): Promise<boolean> {
        return bcrypt.compare(password, this.password);
    }

    hasPermission(permission: keyof Admin['permissions']): boolean {
        if (this.role === AdminRole.SUPER_ADMIN) return true;
        return this.permissions?.[permission] || false;
    }
}