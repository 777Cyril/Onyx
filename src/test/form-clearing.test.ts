/**
 * Unit tests for form clearing functionality
 * Run these tests in the browser console after loading the extension
 */

export class FormClearingTests {
  private testResults: { name: string; passed: boolean; message: string }[] = [];

  /**
   * Test the clearForm method in popup component
   */
  async testPopupClearForm(): Promise<boolean> {
    const testName = 'Popup clearForm method';
    
    try {
      // Create a popup component instance
      const popup = document.createElement('onyx-popup') as any;
      document.body.appendChild(popup);
      
      // Wait for component to initialize
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Set form values
      popup.newTitle = 'Test Title';
      popup.newContent = 'Test Content';
      popup.editingId = 'test-id';
      
      // Call clearForm method
      popup.clearForm();
      
      // Wait for clearing to complete
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Check if values are cleared
      const passed = popup.newTitle === '' && 
                    popup.newContent === '' && 
                    popup.editingId === null;
      
      this.testResults.push({
        name: testName,
        passed,
        message: passed ? 'Form state cleared successfully' : 
                `Failed: title="${popup.newTitle}", content="${popup.newContent}", editingId="${popup.editingId}"`
      });
      
      // Cleanup
      document.body.removeChild(popup);
      
      return passed;
    } catch (error) {
      this.testResults.push({
        name: testName,
        passed: false,
        message: `Error: ${error instanceof Error ? error.message : String(error)}`
      });
      return false;
    }
  }

  /**
   * Test DOM clearing functionality
   */
  async testDOMClearing(): Promise<boolean> {
    const testName = 'DOM input clearing';
    
    try {
      // Create popup component
      const popup = document.createElement('onyx-popup') as any;
      document.body.appendChild(popup);
      
      // Wait for component to render
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Get DOM elements
      const titleInput = popup.shadowRoot?.querySelector('input[type="text"]') as HTMLInputElement;
      const contentTextarea = popup.shadowRoot?.querySelector('textarea') as HTMLTextAreaElement;
      
      if (!titleInput || !contentTextarea) {
        throw new Error('DOM elements not found');
      }
      
      // Set DOM values directly
      titleInput.value = 'DOM Test Title';
      contentTextarea.value = 'DOM Test Content';
      
      // Call clearForm
      popup.clearForm();
      
      // Wait for DOM clearing
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Check if DOM is cleared
      const passed = titleInput.value === '' && contentTextarea.value === '';
      
      this.testResults.push({
        name: testName,
        passed,
        message: passed ? 'DOM inputs cleared successfully' : 
                `Failed: titleInput="${titleInput.value}", contentTextarea="${contentTextarea.value}"`
      });
      
      // Cleanup
      document.body.removeChild(popup);
      
      return passed;
    } catch (error) {
      this.testResults.push({
        name: testName,
        passed: false,
        message: `Error: ${error instanceof Error ? error.message : String(error)}`
      });
      return false;
    }
  }

  /**
   * Test form submission clearing behavior
   */
  async testFormSubmissionClearing(): Promise<boolean> {
    const testName = 'Form submission clearing';
    
    try {
      // Create popup component
      const popup = document.createElement('onyx-popup') as any;
      document.body.appendChild(popup);
      
      // Wait for component to render
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Fill form through component methods
      popup.newTitle = 'Submission Test Title';
      popup.newContent = 'Submission Test Content';
      popup.requestUpdate();
      
      // Wait for update
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Get form element
      const form = popup.shadowRoot?.querySelector('form');
      if (!form) {
        throw new Error('Form not found');
      }
      
      // Mock chrome.storage.sync.set to prevent actual storage operations
      const originalSet = chrome?.storage?.sync?.set;
      if (chrome?.storage?.sync) {
        chrome.storage.sync.set = (() => Promise.resolve()) as any;
      }
      
      // Simulate form submission
      const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
      form.dispatchEvent(submitEvent);
      
      // Wait for form clearing
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Check if form is cleared
      const passed = popup.newTitle === '' && popup.newContent === '';
      
      this.testResults.push({
        name: testName,
        passed,
        message: passed ? 'Form cleared after submission' : 
                `Failed: title="${popup.newTitle}", content="${popup.newContent}"`
      });
      
      // Restore original function
      if (originalSet && chrome?.storage?.sync) {
        chrome.storage.sync.set = originalSet;
      }
      
      // Cleanup
      document.body.removeChild(popup);
      
      return passed;
    } catch (error) {
      this.testResults.push({
        name: testName,
        passed: false,
        message: `Error: ${error instanceof Error ? error.message : String(error)}`
      });
      return false;
    }
  }

  /**
   * Run all tests
   */
  async runAllTests(): Promise<void> {
    console.log('🧪 Starting Form Clearing Tests...\n');
    
    this.testResults = [];
    
    const tests = [
      this.testPopupClearForm.bind(this),
      this.testDOMClearing.bind(this),
      this.testFormSubmissionClearing.bind(this)
    ];
    
    for (const test of tests) {
      await test();
    }
    
    // Print results
    this.printResults();
  }

  /**
   * Print test results
   */
  private printResults(): void {
    console.log('📊 Test Results:');
    console.log('================');
    
    let passedCount = 0;
    
    this.testResults.forEach(result => {
      const status = result.passed ? '✅ PASS' : '❌ FAIL';
      console.log(`${status} ${result.name}: ${result.message}`);
      if (result.passed) passedCount++;
    });
    
    console.log(`\n📈 Summary: ${passedCount}/${this.testResults.length} tests passed`);
    
    if (passedCount === this.testResults.length) {
      console.log('🎉 All tests passed! Form clearing is working correctly.');
    } else {
      console.log('⚠️  Some tests failed. Check the implementation.');
    }
  }

  /**
   * Get test results
   */
  getResults(): { name: string; passed: boolean; message: string }[] {
    return this.testResults;
  }
}

// Export for use in browser console
declare global {
  interface Window {
    FormClearingTests: typeof FormClearingTests;
    runFormClearingTests: () => Promise<void>;
  }
}

// Make available globally for browser console testing
if (typeof window !== 'undefined') {
  window.FormClearingTests = FormClearingTests;
  window.runFormClearingTests = async () => {
    const tests = new FormClearingTests();
    await tests.runAllTests();
  };
}