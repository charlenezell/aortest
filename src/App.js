import React from 'react';
import { jsonServerRestClient, Admin, Resource } from 'admin-on-rest';

// in src/App.js
import { PostList, PostEdit, PostCreate } from './sourceHandler/posts';
import { PostList2, PostEdit2, PostCreate2 } from './sourceHandler/comments';
import {TopicList,TopicListEdit,TopicListCreate} from './sourceHandler/topic';
import restClientRouter from 'aor-rest-client-router';
import customRestClient01 from "./restClients/customRestClient01";
// import { UserList } from './users';

const restRouter = restClientRouter({
  rules: [
    ['posts', 'service1'],
    ['comments', 'service1'],
    ['topic', 'service2']
  ],
  services: {
    service1: jsonServerRestClient('http://jsonplaceholder.typicode.com'),
    service2: customRestClient01
  }
});

const App = () => (
  <Admin restClient={restRouter}>
    <Resource name="posts" list={PostList} edit={PostEdit} create={PostCreate} />
    <Resource name="comments" list={PostList2} edit={PostEdit2} create={PostCreate2} />
    <Resource name="topic" list={TopicList}  edit={TopicListEdit} create={TopicListCreate}/>
  </Admin>
);

export default App;