import os
from playwright.sync_api import sync_playwright, expect

def run_verification():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Get the absolute path to the repository
        repo_path = os.path.abspath('.')

        # --- 1. Verify the main page card layout ---
        index_path = os.path.join(repo_path, 'index.html')
        page.goto(f'file://{index_path}')

        # Locate the specific section to screenshot
        posc320_section = page.locator('#posc320-async')
        expect(posc320_section).to_be_visible()

        # Take a screenshot of the POSC 320 section
        screenshot_path_index = os.path.join('jules-scratch', 'verification', 'index_layout_fix.png')
        posc320_section.screenshot(path=screenshot_path_index)
        print(f"Screenshot of index page saved to {screenshot_path_index}")

        # --- 2. Verify the theme toggle on a lecture page ---
        lecture_path = os.path.join(repo_path, 'POSC320', 'html_page', 'module_0_Welcome.html')
        page.goto(f'file://{lecture_path}')

        # Check initial theme is light
        html_element = page.locator('html')
        expect(html_element).to_have_attribute('data-theme', 'light')

        # Click the theme toggle
        theme_toggle_button = page.locator('.theme-toggle').first
        expect(theme_toggle_button).to_be_visible()
        theme_toggle_button.click()

        # Wait for the theme to change to dark
        expect(html_element).to_have_attribute('data-theme', 'dark')

        # Take a screenshot of the page in dark mode
        screenshot_path_lecture = os.path.join('jules-scratch', 'verification', 'lecture_dark_mode.png')
        page.screenshot(path=screenshot_path_lecture)
        print(f"Screenshot of lecture page in dark mode saved to {screenshot_path_lecture}")

        browser.close()

if __name__ == "__main__":
    run_verification()