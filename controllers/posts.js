const Post = require('../models/Post')

module.exports = {
  getProfile: async (req, res) => {
    try {
      const posts = await Post.find({ user: req.user.id })
      res.render('feed.ejs', { posts: posts, user: req.user })
    } catch (err) {
      console.log(err)
      res.render('error/500.ejs')
    }
  },
  getFeed: async (req, res) => {
    try {
      const posts = await Post.find()
        .sort({ createdAt: 'desc' })
        .lean()
      res.render('feed.ejs', { posts: posts, user: req.user })

    } catch (err) {
      console.log(err)
      res.render('error/404.ejs')
    }
  },
  getPost: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id)
      res.render('single.ejs', { post: post, user: req.user })
    } catch (err) {
      console.log(err)
      res.render('error/404.ejs')
    }
  },
  createPost: async (req, res) => {
    try {
// upload image to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);


      await Post.create({
        title: req.body.title,
        image: '/uploads/' + req.file.filename,
        cloudinaryId: result.public_id, // cloudinary
        caption: req.body.caption,
        likes: 0,
        user: req.user.id
      })
      console.log('Post has been added!')
      res.redirect('/feed')
    } catch (err) {
      console.log(err)
      res.render('error/404.ejs')
    }
  },
  likePost: async (req, res) => {
    try {
      await Post.findOneAndUpdate({ _id: req.params.id },
        {
          $inc: { likes: 1 }
        })
      console.log('Likes +1')
      res.redirect('back')
    } catch (err) {
      console.log(err)
      res.render('error/404.ejs')
    }
  },
  deletePost: async (req, res) => {
    try {
      console.log(req.params)
      await Post.findOneAndDelete({ _id: req.params.id })
      console.log('Deleted Post')
      res.redirect('/feed')
    } catch (err) {
      res.redirect(`/feed`) // i just kept it as a redirect to the feed. can easily change to error page
    }
  },
  editPost: async (req, res) => {
    try {
      console.log(req.body)
      await Post.findOneAndUpdate({ _id: req.params.id }, req.body,
        {
          new: true,
          runValidators: true
        })
      console.log('Post has been editted!')
      res.redirect('/feed')
    } catch (err) {
      console.log(err)
      res.render('error/404.ejs')
    }
  },

}    