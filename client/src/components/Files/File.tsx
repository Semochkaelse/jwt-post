import React, { useState } from 'react';

interface IFile {
  _id: string;
  name: string;
  extension: string;
  mime_type: string;
  size: number;
  upload_date: string;
}

const File: React.FC = () => {
  const [files, setFiles] = useState<FileList | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<IFile[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(event.target.files);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!files) {
      alert('Выберите файлы для загрузки');
      return;
    }

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }

    try {
      const response = await fetch('http://localhost:3001/api/file/uploads', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Ошибка при загрузке файлов');
      }

      const result = await response.json();
      setUploadedFiles(result);
      alert('Файлы успешно загружены');
    } catch (error) {
      console.error('Ошибка при отправке файлов:', error);
      alert('Ошибка при отправке файлов');
    }
  };
  
  const handleDownload = async (id: string, extension: string, name: string) => {
    try {
      const response = await fetch(`http://localhost:3001/api/file/downloads/${id}`);
      if (!response.ok) {
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
    <div>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input
          type="file"
          name="files"
          onChange={handleFileChange}
          multiple
          style={{ display: 'block', marginBottom: '10px' }}
        />
        <button type="submit">Загрузить файлы</button>
      </form>
      <div style={{ marginTop: '20px' }}>
  {uploadedFiles.map((file) => (
    <div
      key={file._id}
      style={{
        display: 'inline-block',
        margin: '10px',
        border: '1px solid #ccc',
        padding: '10px',
        borderRadius: '5px',
      }}
    >
      <div>{file.name}</div>
      <button
        onClick={() => handleDownload(file._id, file.extension, file.name)}
        style={{ marginTop: '5px' }}
      >
        Скачать
      </button>
    </div>
  ))}
</div>
</div>
  )}
           
export default File;