const mongoose = require('mongoose');
const Schema = require('mongoose')

const CommentSchema = mongoose.Schema({
    blog_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'blogs'
    },
    blog_author: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'blogs',
    },
    comment: {
        type: String,
        required: true
    },
    children: {
        type: [Schema.Types.ObjectId],
        ref: 'comments'
    },
    commented_by: {
        type: Schema.Types.ObjectId,
        require: true,
        ref: 'users'
    },
    isReply: {
        type: Boolean,
    },
    parent: {
        type: Schema.Types.ObjectId,
        ref: 'comments'
    }

},
{
    timestamps: {
        createdAt: 'commentedAt'
    }
})

export default mongoose.model("comments", CommentSchema)