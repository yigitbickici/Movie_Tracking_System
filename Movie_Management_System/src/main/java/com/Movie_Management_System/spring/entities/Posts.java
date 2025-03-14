package com.Movie_Management_System.spring.entities;

import jakarta.persistence.*;
import org.hibernate.annotations.Comments;

import java.util.List;
@Entity
@Table(name ="posts")
public class Posts {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer userId;
    private Integer movieId;
    private Integer likeNum;
    private Integer commentNum;
    //private List<Comments> comments;


}
