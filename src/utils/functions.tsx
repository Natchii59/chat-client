// export function sendNotification(title: string, options?: NotificationOptions) {
//   const notificationPermission = Notification.permission

//   console.log(notificationPermission)

//   if (notificationPermission === 'denied') return
//   else if (notificationPermission === 'default') {
//     window.Notification.requestPermission(newPerm => {
//       if (newPerm === 'granted') new window.Notification(title, options)
//     })
//   }

//   new window.Notification(title, options)
// }

// export function showNotification() {
//   Notification.requestPermission(result => {
//     if (result === 'granted') {
//       navigator.serviceWorker.ready.then(registration => {
//         registration.showNotification('Vibration Sample', {
//           body: 'Buzz! Buzz!',
//           icon: '../images/touch/chrome-touch-icon-192x192.png',
//           vibrate: [200, 100, 200, 100, 200, 100, 200],
//           tag: 'vibration-sample'
//         })
//       })
//     }
//   })
// }
