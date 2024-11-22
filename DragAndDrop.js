// Enable drag-and-drop functionality
interact('.draggable')
  .draggable({
    listeners: {
      start(event) {
        console.log(event.type, event.target);
      },
      move(event) {
        // Track the widget's movement
        const target = event.target;
        const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
        const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

        // Update the element's style
        target.style.transform = `translate(${x}px, ${y}px)`;

        // Update the position attributes
        target.setAttribute('data-x', x);
        target.setAttribute('data-y', y);
      },
    },
  });



  interact('.draggable')
  .draggable({
    modifiers: [
      interact.modifiers.restrictRect({
        restriction: '.dashboard', // Restrict to the dashboard container
        endOnly: true,
      }),
    ],
    listeners: {
      start(event) {
        console.log(event.type, event.target);
      },
      move(event) {
        const target = event.target;
        const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
        const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

        target.style.transform = `translate(${x}px, ${y}px)`;
        target.setAttribute('data-x', x);
        target.setAttribute('data-y', y);
      },
    },
  });
