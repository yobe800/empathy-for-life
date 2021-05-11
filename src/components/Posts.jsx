import React from "react";

import styles from "./styles/Posts.module.css";
import Container from "./shared/Container";
import ModalHeader from "./shared/ModalHeader";
import InputButton from "./shared/InputButton";
import Input from "./shared/Input";
import Post from "./shared/Post";

const Posts = () => {
  const posts = postsMock.map(({ _id, writer, content, photo_url, updated_at }) => {
    const writtenDate = new Date(updated_at).toDateString();

    return (
      <Post
        key={_id}
        writer={writer}
        content={content}
        imageSrc={photo_url}
        writtenDate={writtenDate}
      />
    );
  });

  return (
    <Container>
      <ModalHeader text={"게시글"}>
        <div className={styles.inputsContainer}>
          <InputButton text={"글쓰기"} style={{fontSize}} />
          <Input style={{fontSize}} placeholder="검색하기" />
        </div>
      </ModalHeader>
        <div className={styles.postsContainer}>
          {posts}
        </div>
    </Container>
  );
};

const fontSize = "1.5vh";

const postsMock = [
  {
    _id: 1,
    writer: "상엽",
    content: "작은 진도믹스인 에밀리는 자매인 라떼와 달리 겁이 많고 사람에게 아직 쉽게 오지 않아요.\n 처음엔 다른 개들을 조금 무서워서 납작 땅에 엎드렸지만 5월부터 운동장에서 맨날 다른 강아지들과 놀면서 용기가 생겼습니다!",
    photo_url: "/assets/images/emily.jpg",
    created_at: "2021-05-07T22:51:35.505Z",
    updated_at: "2021-05-07T22:51:35.505Z",
  },
  {
    _id: 2,
    writer: "상엽",
    content: "작은 진도믹스인 에밀리는 자매인 라떼와 달리 겁이 많고 사람에게 아직 쉽게 오지 않아요.\n 처음엔 다른 개들을 조금 무서워서 납작 땅에 엎드렸지만 5월부터 운동장에서 맨날 다른 강아지들과 놀면서 용기가 생겼습니다!",
    photo_url: "/assets/images/emily.jpg",
    created_at: "2021-05-07T22:51:35.505Z",
    updated_at: "2021-05-07T22:51:35.505Z",
  },
  {
    _id: 3,
    writer: "상엽",
    content: "작은 진도믹스인 에밀리는 자매인 라떼와 달리 겁이 많고 사람에게 아직 쉽게 오지 않아요.\n 처음엔 다른 개들을 조금 무서워서 납작 땅에 엎드렸지만 5월부터 운동장에서 맨날 다른 강아지들과 놀면서 용기가 생겼습니다!",
    photo_url: "/assets/images/emily.jpg",
    created_at: "2021-05-07T22:51:35.505Z",
    updated_at: "2021-05-07T22:51:35.505Z",
  },
];

export default Posts;
