import React from 'react';
import { createPortal } from 'react-dom';
import PostForm from '../PostForm/PostForm';
import { INews } from '../../models/interfaces';

interface EditPostModalProps {
  onClose: () => void;
  post?: INews;
}

const EditPostModal: React.FC<EditPostModalProps> = ({ onClose, post }) => {

  if (!post) {
    return null;
  }

  const handleModalClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return createPortal(
    <div className="modal" onClick={handleModalClick}>
      <div className="modal-content">
        <PostForm post={post} onClose={onClose}/>
      </div>
    </div>,
    document.getElementById('modal-root')!
  );
};

export default EditPostModal;
