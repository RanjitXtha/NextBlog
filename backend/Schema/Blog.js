const mongoose = require('mongoose');
const Schema = require('mongoose')

const BlogSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    banner: {
        type: String,
    },
    des: {
        type: String,
        maxlength: 200,
    },
    content: {
        type: String,
        required:true,
    },
    tags: {
        type: [String],
    },
    author: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'users'
    },
    activity: {
        total_likes: {
            type: Number,
            default: 0
        },
        total_comments: {
            type: Number,
            default: 0
        },
        total_reads: {
            type: Number,
            default: 0
        },
    },
    comments: {
        type: [Schema.Types.ObjectId],
        ref: 'comments',
        default:[]
    },
}, 
{ 
    timestamps: {
        createdAt: 'publishedAt'
    } 

})

module.exports = mongoose.model("Blog",BlogSchema);