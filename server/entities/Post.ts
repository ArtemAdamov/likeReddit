// import {Entity, PrimaryKey, Property} from "@mikro-orm/core";
import {Field, Int, ObjectType} from "type-graphql";
import {BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
@ObjectType()
@Entity()
export class Post extends BaseEntity{
    @Field(() => Int)
    @PrimaryGeneratedColumn()
    id!: number;
    @Field(() => String)
    @Column({type: "text"})
    title!: string;
    @Field()
    @CreateDateColumn({type: "date"})
    createdAt: Date;

    @Field()
    @UpdateDateColumn({ type: "date"})
        // @CreateDateColumn({ type: "date", onUpdate: () => new Date() })
    updatedAt: Date;
}