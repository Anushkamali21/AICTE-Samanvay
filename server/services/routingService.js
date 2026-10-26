export const determineRoutingCell = (category, priority) => {
  switch (category) {
    case 'Academic Issues':
    case 'Examination and Evaluation':
    case 'Admission and Documentation':
      return {
        cell: 'Academic Affairs and Examination Redressal Cell',
        suggestedSLA: '10 business days',
        escalationThresholdDays: 10
      };

    case 'Faculty-Related Issues':
    case 'Scholarship Issues':
      return {
        cell: 'Research, Faculty Welfare and Development Bureau',
        suggestedSLA: '14 business days',
        escalationThresholdDays: 14
      };

    case 'Fee-Related Issues':
    case 'Administrative Issues':
    case 'Institutional Management':
      return {
        cell: 'Finance, Compliance and Institutional Audit Cell',
        suggestedSLA: '7 business days',
        escalationThresholdDays: 7
      };

    case 'Infrastructure and Laboratory Facilities':
    case 'Hostel and Campus Facilities':
      return {
        cell: 'Campus Infrastructure and Facilities Cell',
        suggestedSLA: '14 business days',
        escalationThresholdDays: 14
      };

    case 'Harassment, Discrimination, or Misconduct':
    case 'Safety and Student Welfare':
      return {
        cell: 'Confidential Redressal & Anti-Harassment Cell',
        suggestedSLA: '3 business days',
        escalationThresholdDays: 3
      };

    case 'Non-Teaching Staff Issues':
      return {
        cell: 'Establishment and Non-Teaching Staff Welfare Bureau',
        suggestedSLA: '14 business days',
        escalationThresholdDays: 14
      };

    default:
      return {
        cell: 'Central Grievance Coordination Cell',
        suggestedSLA: '14 business days',
        escalationThresholdDays: 14
      };
  }
};

export const calculateSlaStatus = (createdAt, category, currentStatus) => {
  // If resolved or closed, SLA is fulfilled
  if (currentStatus === 'Resolved' || currentStatus === 'Closed') {
    return {
      status: 'Fulfilled',
      badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-300',
      daysRemaining: 0,
      label: 'SLA Fulfilled'
    };
  }

  const routing = determineRoutingCell(category);
  const thresholdDays = routing.escalationThresholdDays || 14;
  const created = new Date(createdAt);
  const now = new Date();
  
  const elapsedDays = Math.floor((now - created) / (1000 * 60 * 60 * 24));
  const remainingDays = thresholdDays - elapsedDays;

  if (remainingDays < 0) {
    return {
      status: 'Overdue',
      badgeClass: 'bg-red-50 text-red-800 border-red-300',
      daysRemaining: remainingDays,
      label: `Overdue by ${Math.abs(remainingDays)} day(s) - Escalation Triggered`
    };
  } else if (remainingDays <= 2) {
    return {
      status: 'Approaching',
      badgeClass: 'bg-amber-50 text-amber-800 border-amber-300',
      daysRemaining: remainingDays,
      label: `Approaching Deadline: ${remainingDays} day(s) remaining`
    };
  } else {
    return {
      status: 'OnSchedule',
      badgeClass: 'bg-blue-50 text-blue-800 border-blue-200',
      daysRemaining: remainingDays,
      label: `Within SLA: ${remainingDays} day(s) remaining`
    };
  }
};

export default determineRoutingCell;
