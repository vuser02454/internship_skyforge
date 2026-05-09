import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';

export function startTour() {
  const path = window.location.pathname;

  let steps = [];

  if (path === '/') {
    // Dashboard Tour
    steps = [
      { 
        popover: { title: 'Welcome to TaskForge! 🚀', description: 'Let us show you how to navigate the platform and maximize your freelancing potential.', align: 'center' }
      },
      { 
        element: '#tour-earnings', 
        popover: { title: 'Interactive Graphs 📈', description: 'Track your exact revenue compared to the platform average. Hover over the bars for detailed numbers.', side: "bottom", align: 'start' }
      },
      { 
        element: '#tour-nav-dashboard', 
        popover: { title: 'Dashboard', description: 'Your home base. This link will always bring you back here.', side: "right", align: 'center' }
      },
      { 
        element: '#tour-nav-active', 
        popover: { title: 'Active Tasks', description: 'Manage the jobs you are currently working on here.', side: "right", align: 'center' }
      },
      { 
        element: '#tour-post-task', 
        popover: { title: 'Need to hire someone? 🤝', description: 'Click here to post your own tasks for our community to solve.', side: "right", align: 'center' }
      }
    ];
  } else if (path === '/work-submission') {
    // Active Tasks / Work Submission Tour
    steps = [
      { 
        popover: { title: 'Active Tasks 💼', description: 'This is where you manage your in-progress work and communicate with clients.', align: 'center' }
      },
      { 
        element: '#tour-upload', 
        popover: { title: 'Submit Your Work 📤', description: 'Drag and drop your finished project files, PDFs, or ZIPs here to submit them for review.', side: "top", align: 'center' }
      },
      { 
        element: '#tour-chat', 
        popover: { title: 'Direct Client Chat 💬', description: 'Communicate directly with the client. Ask questions, clarify requirements, or request revisions here.', side: "left", align: 'start' }
      }
    ];
  } else if (path === '/task-detail') {
    // Earnings / Task Detail Tour
    steps = [
      { 
        popover: { title: 'Task Details 📄', description: 'Review the full scope of a task before you decide to apply or accept.', align: 'center' }
      },
      { 
        element: '#tour-quick-apply', 
        popover: { title: 'Quick Apply ⚡', description: 'Write a short pitch and securely attach your PDF resume. Submitting here notifies the client instantly.', side: "left", align: 'start' }
      },
      { 
        element: '#tour-save-later', 
        popover: { title: 'Save it for later 🔖', description: 'Not ready to apply? Save the job and it will appear in your Saved Jobs list.', side: "top", align: 'center' }
      }
    ];
  } else if (path === '/realtime-tasks') {
    // Live Tasks Tour
    steps = [
      { 
        popover: { title: 'Live Task Marketplace ⚡', description: 'Our real-time engine! Watch new tasks stream in instantly.', align: 'center' }
      },
      { 
        element: '#tour-live-badge', 
        popover: { title: 'Live Connection Status 🟢', description: 'As long as this badge is pulsing, you are connected to the live database feed.', side: "bottom", align: 'end' }
      },
      { 
        element: '#tour-live-feed', 
        popover: { title: 'The Feed 📋', description: 'Tasks appear here the second they are posted. Click Accept to lock it in before anyone else does!', side: "top", align: 'center' }
      }
    ];
  } else {
    // Generic fallback tour
    steps = [
      { 
        popover: { title: 'Platform Navigation 🧭', description: 'You can use the sidebar on the left to navigate to your Dashboard, Active Tasks, Live Feed, and Settings.', align: 'center' }
      }
    ];
  }

  const driverObj = driver({
    showProgress: true,
    animate: true,
    showButtons: ['next', 'previous', 'close'],
    popoverClass: 'taskforge-tour-popover',
    steps: steps
  });
  
  driverObj.drive();
}
