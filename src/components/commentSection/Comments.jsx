import React from 'react';

const Comments = ({ comments }) => {

    return (
        <div className={`flex flex-col gap-2 border border-gray-300 rounded-md p-4 ${comments.length === 0 ? 'hidden' : ''}`}>
            {comments.map((comment, index) => (
                <div
                    key={index}
                    className={`comment ${index === comments.length ? 'text-center' : ''}`}>
                    <div>
                        <div className={`flex flex-row justify-between`}>
                            <span className={`text-gray-500`}>{comment.name}</span>
                            <span className={`text-gray-500`}>{comment.createdAt}</span>
                        </div>
                        <div className={`mt-2 flex`}>
                            {comment.body}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Comments;