'use client';
import styles from "../styles/NewPost.module.css";
import React, { useState } from 'react';
import { useRouter } from "next/navigation";

export default function PostForm() {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState('');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const handleCancel = () => {
        const confirmCancel = window.confirm("게시글 작성을 취소하시겠습니까?");
        if (confirmCancel) {
            router.push('/community');
        }
    };

    const options = [
        { label: '정보 공유', value: 'notice' },
        { label: 'Q&A', value: 'QandA' },
    ];

    return (
        <div className={styles.wrapper}>
       <div className={styles.container}>
           <div style={{fontSize:"30px",textAlign:"center"}} >새 게시글 등록</div>
           <div className={styles.selectpost}>
                <div className={styles.label}>게시판 선택</div>
               <div style={{ position: 'relative', width: '574px' }}>
                   <div
                       onClick={() => setOpen(!open)}
                       style={{
                           padding: '10px 12px',
                           border: '1px solid #E5E7EB',
                           borderRadius: '8px',
                           backgroundColor: '#FFFFFF',
                           color: selected ? '#111827' : '#9CA3AF',
                           cursor: 'pointer',
                       }}
                   >
                       {selected ? options.find(o => o.value === selected)?.label : '게시판을 선택해주세요.'}
                   </div>
                   {open && (
                       <ul
                           style={{
                               position: 'absolute',
                               top: '100%',
                               left: 0,
                               width: '100%',
                               backgroundColor: '#FFFFFF',
                               border: '1px solid #E5E7EB',
                               borderRadius: '8px',
                               marginTop: '4px',
                               zIndex: 10,
                           }}
                       >
                           {options.map((option) => (
                               <li
                                   key={option.value}
                                   onClick={() => {
                                       setSelected(option.value);
                                       setOpen(false);
                                   }}
                                   style={{
                                       padding: '10px 12px',
                                       cursor: 'pointer',
                                       color: '#111827',
                                       borderBottom: '1px solid #E5E7EB',
                                   }}
                               >
                                   {option.label}
                               </li>
                           ))}
                       </ul>
                   )}
               </div>
           </div>
           <div className={styles.formContainer}>
               <div className={styles.label}>게시글 제목</div>
               <input
                   type="text"
                   className={styles.inputBox}
                   placeholder="제목을 입력해주세요."
                   value={title}
                   onChange={e => setTitle(e.target.value)}
               />
           </div>
           <div className={styles.content}>
               <div className={styles.label}>게시글 내용</div>
               <textarea
                   className={styles.contentBox}
                   placeholder="게시글 내용을 입력해주세요."
                   value={content}
                   onChange={e => setContent(e.target.value)}
               />
           </div>
           <div className={styles.btnarea}>
               <button  onClick={handleCancel}  className={styles.cancelButton}>취소</button>
               <button className={styles.submitButton}>게시글 등록</button>
           </div>
       </div>
        </div>
    );
}
