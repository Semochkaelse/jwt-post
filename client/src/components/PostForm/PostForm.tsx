import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertFromRaw, convertToRaw } from 'draft-js';
import { RootState } from '../../store/store';
import { INews } from '../../models/interfaces';

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import './PostForm.css';

interface IFormInput {
  title: string;
  body: EditorState;
  files: File[];
  publishedAt: string;
}

interface PostFormProps {
  post?: INews;
  onClose?: () => void;
}

const PostForm: React.FC<PostFormProps> = ({ post, onClose }) =>  {
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<IFormInput>();
  const authorId = useSelector((state: RootState) => state.user.id);
  const [editorState, setEditorState] = React.useState(() => EditorState.createEmpty());
  const navigate = useNavigate();

  useEffect(() => {
    if (post) {
      setValue('title', post.title);
      setValue('publishedAt', post.publishedAt);
      setEditorState(EditorState.createWithContent(convertFromRaw(JSON.parse(post.body))));
      setValue('body', EditorState.createWithContent(convertFromRaw(JSON.parse(post.body))));
    }
  }, [post, setValue]);

  const onSubmit = async (data: IFormInput) => {
    const publishedAt = data.publishedAt ? new Date(data.publishedAt) : new Date();

    const formData = new FormData();
    formData.append('authorId', authorId);
    formData.append('title', data.title);
    formData.append('body', JSON.stringify(convertToRaw(data.body.getCurrentContent())));
    formData.append('publishedAt', publishedAt.toDateString()); 
    if (data.files) {
      for (let i = 0; i < data.files.length; i++) {
        formData.append('files', data.files[i]);
      }
    }

    try {
      const token = localStorage.getItem('token');
      const method = post ? 'PUT' : 'POST';
      const url = post
      ? `http://localhost:3001/api/news/${post._id}`
      : 'http://localhost:3001/api/news';
      const response = await fetch(url, {
        method,
        body: formData,
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      await response.json();
      const modalRoot = document.getElementById('modal-root');
      if (modalRoot) {
        modalRoot.style.display = 'none';
      }
      navigate('/');
      reset();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="post-form-container">
      {post ? 
    <button className="modal-close" onClick={onClose}>
      &times;
    </button>
    : 
    <></>  
    }
      <form onSubmit={handleSubmit(onSubmit)} className="post-form">
        <h2>{post ? 'Edit' : 'Create'} Post</h2>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          {...register('title', { required: 'Title is required' })}
        />
        {errors.title && <p>{errors.title.message}</p>}

        <label htmlFor="body">Body</label>
        <Editor
          editorState={editorState}
          toolbarClassName="toolbarClassName"
          wrapperClassName="wrapperClassName"
          editorClassName="editorClassName"
          onEditorStateChange={editorState => {
            setEditorState(editorState);
            setValue('body', editorState);
          }}
        />

        <label htmlFor="files">Upload Files (optional)</label>
        <input
          id="files"
          type="file"
          {...register('files')}
          multiple
        />

        <label htmlFor="publishedAt">Publish at (optional)</label>
        <input
          id="publishedAt"
          type="datetime-local"
          {...register('publishedAt')}
        />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default PostForm;

