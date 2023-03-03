// import {Entity, PrimaryKey, Property} from "@mikro-orm/core";
import {Field, Int, ObjectType} from "type-graphql";
import {BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
@ObjectType()
@Entity()
export class User extends BaseEntity{
    @Field(() => Int)
    @PrimaryGeneratedColumn()
    id!: number;

    @Field(() => String)
    @Column({type: "text", unique: true})
    username!: string;

    @Field(() => String)
    @Column({type: "text", unique: true, nullable: true})
    email!: string;

    @Column({type: "text"})
    password!: string;

    @Field()
    @CreateDateColumn({type: "date"})
    createdAt: Date;

    @Field()
    @UpdateDateColumn({ type: "date"})
    // @CreateDateColumn({ type: "date", onUpdate: () => new Date() })
    updatedAt: Date;
}