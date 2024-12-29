(function() {
  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.type = 'module'  // Add type="module"
      script.src = src
      script.onload = resolve
      script.onerror = reject
      document.head.appendChild(script)
    })
  }

  async function init() {
    if (!window.UserBird?.formId) {
      console.error('[Userbird] No form ID provided')
      return
    }

    try {
      // Initialize Userbird object before loading the bundle
      window.Userbird = window.Userbird || {}
      
      // Load the widget bundle
      await loadScript('https://userbird.netlify.app/widget.bundle.js')
      
      // Initialize the widget using the correct casing
      if (window.Userbird?.init) {
        window.Userbird.init({
          formId: window.UserBird.formId
        })
      } else {
        throw new Error('Widget initialization failed')
      }
    } catch (error) {
      console.error('[Userbird] Failed to load widget:', error)
    }
  }

  init()
})()