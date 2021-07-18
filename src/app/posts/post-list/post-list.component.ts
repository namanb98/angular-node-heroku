import { Component,OnDestroy,OnInit} from '@angular/core';
import { Post } from "../post.model";
import { Subscription } from 'rxjs'
import { PostService } from '../post.service';
import { PageEvent } from "@angular/material/paginator";
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy{

posts: Post[] = [];
isLoading = false;
private postsSub: Subscription;
private authStatusSub:  Subscription;
totalPosts = 0;
currentPage = 1;
postsPerPage = 2;
pageSizeOptions = [1,2,5,10];
userIsAuthenticated = false;
userId: string;

constructor(public postServive: PostService,private authService: AuthService){}

  ngOnInit()
  {
    this.isLoading = true;
    this.postServive.getPosts(this.postsPerPage,this.currentPage);
    this.userId = this.authService.getUserId();
    this.postsSub = this.postServive.getPostUpdatedListener()
    .subscribe((postData: {posts: Post[],postCount: number}) => {
      this.isLoading = false;
      this.totalPosts = postData.postCount;
      this.posts = postData.posts;
    });
     this.userIsAuthenticated = this.authService.getIsAuth();
     this.authStatusSub = this.authService
     .getAuthStatusListener()
     .subscribe(isAuthenticated => {
       this.userIsAuthenticated = isAuthenticated;
       this.userId = this.authService.getUserId();
      });
  }

  onChangePage(pageData: PageEvent)
  {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postServive.getPosts(this.postsPerPage,this.currentPage);
  }

  onDelete(postId: string)
  {
  this.isLoading = true;
  this.postServive.deletePost(postId).subscribe(() =>{
    this.postServive.getPosts(this.postsPerPage,this.currentPage);
  }, () => {
    this.isLoading = false;
  })
  }

  ngOnDestroy()
  {
    this.postsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
}
