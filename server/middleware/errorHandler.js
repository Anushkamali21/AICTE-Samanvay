export const errorHandler = (err, req, res, next) => {
  console.error('[Error Handler]', err);

  // Multer errors
  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File upload error: File size exceeds the maximum limit of 5 MB.'
      });
    }
    return res.status(400).json({
      success: false,
      message: `File upload error: ${err.message}`
    });
  }

  // Custom file filter error
  if (err.message && err.message.includes('Invalid file format')) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error. An unexpected error occurred on the server.'
  });
};

export default errorHandler;
