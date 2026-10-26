import memoryStore from '../services/memoryStore.js';
import { COMPLAINT_STATUSES } from '../config/constants.js';

export const submitFeedback = async (req, res, next) => {
  try {
    const { complaintId } = req.params;
    const { rating, effectiveness, timeliness, communication, fairness, resolvedAdequately, comments } = req.body;

    if (!rating || !effectiveness || !timeliness || !communication || !fairness || !resolvedAdequately) {
      return res.status(400).json({
        success: false,
        message: 'All feedback rating parameters and resolution confirmation are required.'
      });
    }

    const complaint = memoryStore.findComplaintById(complaintId);
    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint record not found.' });
    }

    // Verify user is complainant
    if (complaint.complainantId !== req.user._id && complaint.complainantEmail.toLowerCase() !== req.user.email.toLowerCase()) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You can only submit satisfaction feedback for your own complaints.'
      });
    }

    // Must be resolved or closed
    if (complaint.currentStatus !== COMPLAINT_STATUSES.RESOLVED && complaint.currentStatus !== COMPLAINT_STATUSES.CLOSED) {
      return res.status(400).json({
        success: false,
        message: 'Feedback can only be submitted after a complaint has been formally resolved.'
      });
    }

    // Prevent duplicate feedback
    const existing = memoryStore.getFeedbackForComplaint(complaint._id);
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Feedback has already been recorded for this complaint.'
      });
    }

    const newFeedback = memoryStore.addFeedback({
      complaintId: complaint._id,
      referenceId: complaint.referenceId,
      complainantId: req.user._id,
      rating: Number(rating),
      effectiveness: Number(effectiveness),
      timeliness: Number(timeliness),
      communication: Number(communication),
      fairness: Number(fairness),
      resolvedAdequately,
      comments: comments ? comments.trim() : ''
    });

    memoryStore.addHistory({
      complaintId: complaint._id,
      referenceId: complaint.referenceId,
      previousStatus: complaint.currentStatus,
      newStatus: complaint.currentStatus,
      action: 'Complainant Feedback Recorded',
      actorId: req.user._id,
      actorName: req.user.name,
      actorRole: req.user.role,
      userVisibleExplanation: `Complainant submitted resolution satisfaction feedback (Rating: ${rating}/5).`
    });

    return res.status(201).json({
      success: true,
      message: 'Thank you. Your feedback has been recorded successfully.',
      feedback: newFeedback
    });
  } catch (error) {
    next(error);
  }
};

export const getFeedbackForComplaint = async (req, res, next) => {
  try {
    const { complaintId } = req.params;
    const feedback = memoryStore.getFeedbackForComplaint(complaintId);

    return res.status(200).json({
      success: true,
      feedback: feedback || null
    });
  } catch (error) {
    next(error);
  }
};

export const getFeedbackAnalytics = async (req, res, next) => {
  try {
    const all = memoryStore.getAllFeedback();
    const count = all.length;

    if (count === 0) {
      return res.status(200).json({
        success: true,
        summary: {
          totalFeedback: 0,
          averageRating: 0,
          averageEffectiveness: 0,
          averageTimeliness: 0,
          averageCommunication: 0,
          averageFairness: 0,
          adequateResolutionPercentage: 0
        },
        ratingDistribution: []
      });
    }

    const avgRating = (all.reduce((acc, f) => acc + f.rating, 0) / count).toFixed(1);
    const avgEff = (all.reduce((acc, f) => acc + f.effectiveness, 0) / count).toFixed(1);
    const avgTime = (all.reduce((acc, f) => acc + f.timeliness, 0) / count).toFixed(1);
    const avgComm = (all.reduce((acc, f) => acc + f.communication, 0) / count).toFixed(1);
    const avgFair = (all.reduce((acc, f) => acc + f.fairness, 0) / count).toFixed(1);

    const yesCount = all.filter(f => f.resolvedAdequately === 'Yes').length;
    const adequatePct = Math.round((yesCount / count) * 100);

    const ratingDistribution = [5, 4, 3, 2, 1].map(stars => ({
      stars: `${stars} Stars`,
      count: all.filter(f => f.rating === stars).length
    }));

    return res.status(200).json({
      success: true,
      summary: {
        totalFeedback: count,
        averageRating: Number(avgRating),
        averageEffectiveness: Number(avgEff),
        averageTimeliness: Number(avgTime),
        averageCommunication: Number(avgComm),
        averageFairness: Number(avgFair),
        adequateResolutionPercentage: adequatePct
      },
      ratingDistribution
    });
  } catch (error) {
    next(error);
  }
};
