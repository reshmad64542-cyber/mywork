const express = require('express');
const multer = require('multer');
const router = express.Router();

// simple memory storage
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 20 * 1024 * 1024 } });

router.post('/', upload.single('file'), (req, res) => {
  try {
    const info = {
      headers: {
        'content-type': req.headers['content-type'],
        'content-length': req.headers['content-length']
      },
      file: req.file ? { originalname: req.file.originalname, size: req.file.size, mimetype: req.file.mimetype } : null,
      bodyKeys: req.body ? Object.keys(req.body) : []
    };

    console.log('[upload-echo] received upload info:', info);
    return res.json({ success: true, info });
  } catch (err) {
    console.error('[upload-echo] error:', err);
    return res.status(500).json({ success: false, error: 'Echo failed' });
  }
});

module.exports = router;
