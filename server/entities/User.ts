// import {Entity, PrimaryKey, Property} from "@mikro-orm/core";
import {Field, Int, ObjectType} from "type-graphql";
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {Post} from "./Post";
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

    @OneToMany(() => Post, (post) => post.creator)
    posts: Post[]

    @Field(() => String)
    @CreateDateColumn()
    createdAt: Date;

    @Field(() => String)
    @UpdateDateColumn()
    // @CreateDateColumn({ type: "date", onUpdate: () => new Date() })
    updatedAt: Date;
}