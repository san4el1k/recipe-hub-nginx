import React, {useContext, useEffect, useRef} from 'react';
import Comments from "./Comments.jsx";
import axios from "axios";
import {Context} from "../../main.jsx";
import { HandHeart } from "lucide-react"

const CommentSection = ({ id, handleLike, liked }) => {
    const { user } = useContext(Context);
    const [comments, setComments] = React.useState([]);
    const [commentValue, setCommentValue] = React.useState('');
    const textareaRef = useRef(null); // добавили ref для textarea

    // функция авторасширения
    const handleInput = (e) => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto'; // сброс высоты
            textarea.style.height = textarea.scrollHeight + 'px'; // установка по содержимому
        }
        setCommentValue(e.target.value);
    };

    const fetchComments = async () => {
        try {
            const res = await axios.get(`https://recipehub.online/api/recipes/${id}/comments`);
            setComments(res.data);
        } catch (e) {
            console.error(e);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        try {
            const res = await fetch(`https://recipehub.online/api/recipes/${id}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    body: commentValue,
                    name: user.name,
                    email: user.email,
                    userId: user.id
                })
            });

            if (res.ok) {
                fetchComments()
            } else {
                console.error('ERROR:', res.status, await res.text());
            }
        } catch (e) {
            console.error(e);
        } finally {
            setCommentValue('')
        }
    }

    useEffect(() => {
        fetchComments();
    }, []);

    return (
        <div className="w-full lg:max-w-[1100px] md:max-w-[900px] flex flex-col gap-4 p-3 sm:p-6 pt-0 self-center">
            <div className="flex flex-col bg-white rounded-xl p-6 border border-gray-300 w-full">
                <div className="flex justify-between items-center">
                    <h4 className='text-lg font-bold'>Comments</h4>
                    <div className="flex">
                        <HandHeart
                            onClick={handleLike}
                            size={32}
                            className={`cursor-pointer transition-all duration-300 ${liked ? 'text-red-900 hover:text-gray-500' : 'text-gray-500 hover:text-gray-900'}`}
                        />
                    </div>
                </div>

                <div className='flex flex-col gap-2 mt-4'>
                    <div className='flex flex-col gap-2'>
                        <div className='flex items-center gap-2'>
                            <div className='flex gap-2 w-full'>
                                <textarea
                                    ref={textareaRef} // добавляем ref
                                    value={commentValue}
                                    onChange={handleInput} // заменяем onChange
                                    placeholder='Add a comment...'
                                    className='p-3 bg-gray-100 rounded-md w-full outline-none focus-visible:ring-[3px] transition-all focus-visible:ring-gray-300 min-h-[100px] h-auto resize-none overflow-hidden'
                                />
                            </div>
                        </div>
                        <div
                            className={`flex flex-col gap-2 self-end transition-all ease-in-out duration-300 ${
                                commentValue ? 'opacity-100 max-h-20' : 'opacity-0 max-h-0 overflow-hidden'
                            }`}
                        >
                            <button
                                disabled={!commentValue}
                                onClick={handleSubmit}
                                className={`bg-gray-900 text-white px-4 py-2 rounded-md transition-all hover:bg-gray-700 ${
                                    commentValue ? 'cursor-pointer' : 'cursor-not-allowed'
                                }`}
                            >
                                Comment
                            </button>
                        </div>
                    </div>
                    {comments.length === 0 && <p className='text-sm text-center text-gray-500'>Be the first to comment</p>}

                    <Comments
                        comments={comments}
                    />
                </div>
            </div>
        </div>
    );
};

export default CommentSection;
