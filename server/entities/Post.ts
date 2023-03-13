// import {Entity, PrimaryKey, Property} from "@mikro-orm/core";
import {Field, Int, ObjectType} from "type-graphql";
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {User} from "./User";
@ObjectType()
@Entity()
export class Post extends BaseEntity{
    @Field(() => Int)
    @PrimaryGeneratedColumn()
    id!: number;
    @Field(() => String)
    @Column({type: "text"})
    title!: string;
    @Field(() => String)
    @Column({type: "text"})
    text!: string;
    @Field(() => String)
    @Column({type: "int", default: 0})
    points!: number;
    @Field(() => Int)
    @Column()
    creatorId: number;
    @ManyToOne(() => User, (user) => user.posts)
    creator: User
    @Field()
    @CreateDateColumn({type: "date"})
    createdAt: Date;

    @Field()
    @UpdateDateColumn({ type: "date"})
        // @CreateDateColumn({ type: "date", onUpdate: () => new Date() })
    updatedAt: Date;
}