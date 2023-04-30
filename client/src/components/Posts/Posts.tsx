import React, { useEffect, useState } from 'react';
import { stateToHTML } from 'draft-js-export-html';
import { convertFromRaw } from 'draft-js';

import { isValidJson } from '../../utils/isValidJSON'
import { INews } from '../../models/interfaces';
import EditPostModal from '../EditPostModal/EditPostModal';
import './Posts.css';

const Posts: React.FC = () => {
  const [news, setNews] = useState<INews[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<INews | null>(null);

  const openEditModal = (post: INews) => {
    setSelectedPost(post);
    setIsEditModalOpen(true);
    const modalRoot = document.getElementById('modal-root');
    if (modalRoot) {
      modalRoot.style.display = 'flex';
    }
  };

  const closeEditModal = () => {
    setSelectedPost(null);
    setIsEditModalOpen(false);
    const modalRoot = document.getElementById('modal-root');
    if (modalRoot) {
      modalRoot.style.display = 'none';
    }
  };

  const deletePost = async (post: INews) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:3001/api/news/${post._id}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Authorization': `Bearer ${token}`,
      }
      });
    await response.json();
    setNews([...news.filter((el) => el._id !== post._id)]);
  }
  
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3001/api/news', {
          credentials: 'include',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setNews(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchNews();
  }, []);

  const handleDownload = async (id: string, extension: string, name: string) => {
    try {
      const response = await fetch(`http://localhost:3001/api/file/downloads/${id}`);
      if (!response.ok) {
        console.log(response);
        
        throw new Error('Ошибка при скачивании файла');
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${name}.${extension}`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Ошибка при скачивании файла:', error);
      alert('Ошибка при скачивании файла');
    }
  };

  return (
    <div className="news-list">
      <h1>News List</h1>
      {news.length > 0 &&
        news.map((item) => (
          <div key={item._id} className="news-item">
            <h2>{item.title}</h2>
            <p
              dangerouslySetInnerHTML={{
                __html: item.body && isValidJson(item.body)
                  ? stateToHTML(convertFromRaw(JSON.parse(item.body)))
                  : "",
              }}
            />
            <div className="files-container">
              {item.files.map((file) => {
                const displayName = file.name.slice(14);
                const truncatedName =
                  displayName.length > 20
                    ? displayName.slice(0, 20) + "..."
                    : displayName;
  
                return (
                  <div key={file._id} className="file-info">
                    <span title={displayName}>{truncatedName}</span>
                    <button
                      onClick={() =>
                        handleDownload(file._id, file.extension, file.name)
                      }
                      className="download-button"
                    >
                      Download
                    </button>
                  </div>
                );
              })}
            </div>
            <button onClick={() => openEditModal(item)}>Изменить пост</button>
            <button onClick={() => deletePost(item)}>Удалить пост</button>
          </div>
        ))}
        {isEditModalOpen && selectedPost ?
        <EditPostModal post={selectedPost} onClose={closeEditModal}/> : <></>}
    </div>
  );
};

export default Posts;
