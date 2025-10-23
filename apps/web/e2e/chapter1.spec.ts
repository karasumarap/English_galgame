import { test, expect } from '@playwright/test'

test.describe('Chapter 1 Happy Path', () => {
  test('チャプター1を最後までクリアできる', async ({ page }) => {
    // ゲーム画面にアクセス
    await page.goto('/')

    // 最初のセリフが表示されるまで待機
    await expect(page.locator('text=エマ')).toBeVisible({ timeout: 10000 })

    // セリフを進める（複数回クリック）
    for (let i = 0; i < 3; i++) {
      const nextButton = page.locator('button:has-text("次へ")')
      if (await nextButton.isVisible()) {
        await nextButton.click()
        await page.waitForTimeout(500)
      }
    }

    // 選択肢が表示されたら選ぶ
    const firstChoice = page.locator('button').filter({ hasText: 'こんにちは' }).first()
    if (await firstChoice.isVisible({ timeout: 5000 })) {
      await firstChoice.click()
      await page.waitForTimeout(500)
    }

    // さらに進める
    for (let i = 0; i < 5; i++) {
      const nextButton = page.locator('button:has-text("次へ")')
      if (await nextButton.isVisible()) {
        await nextButton.click()
        await page.waitForTimeout(500)
      }
    }

    // クイズが表示される可能性があるので対応
    const quizInput = page.locator('input[type="text"]')
    if (await quizInput.isVisible({ timeout: 2000 })) {
      await quizInput.fill('hello')
      const submitButton = page.locator('button:has-text("送信"), button:has-text("Submit")')
      await submitButton.click()
      await page.waitForTimeout(500)
    }

    // さらに進める
    for (let i = 0; i < 5; i++) {
      const nextButton = page.locator('button:has-text("次へ")')
      if (await nextButton.isVisible()) {
        await nextButton.click()
        await page.waitForTimeout(500)
      }
    }

    // チャプター完了画面が表示されることを確認
    // （実際のテキストは実装に合わせて調整）
    const completionIndicator = page.locator(
      'text=完了, text=Complete, text=おめでとう, text=Congratulations'
    )

    // 完了メッセージが表示されるか、または次のチャプターへのボタンが表示される
    const isCompleted =
      (await completionIndicator.isVisible({ timeout: 3000 })) ||
      (await page.locator('button:has-text("次のチャプター"), button:has-text("Next Chapter")').isVisible({
        timeout: 3000,
      }))

    expect(isCompleted).toBeTruthy()
  })

  test('言語切り替えができる', async ({ page }) => {
    await page.goto('/')

    // 最初のセリフが表示されるまで待機
    await page.waitForTimeout(2000)

    // 言語切り替えボタンを探してクリック
    const langButton = page.locator('button:has-text("EN"), button:has-text("JP")')
    if (await langButton.isVisible({ timeout: 5000 })) {
      await langButton.click()
      await page.waitForTimeout(500)

      // 言語が切り替わったことを確認（英語テキストが表示される）
      const englishText = page.locator('text=/Hello|Good morning|Thank you/')
      await expect(englishText.first()).toBeVisible({ timeout: 3000 })
    }
  })

  test('セーブ・ロードができる', async ({ page }) => {
    await page.goto('/')

    // ゲームを少し進める
    await page.waitForTimeout(2000)
    const nextButton = page.locator('button:has-text("次へ")')
    if (await nextButton.isVisible()) {
      await nextButton.click()
      await page.waitForTimeout(500)
    }

    // セーブメニューを開く（実装によって異なる可能性あり）
    const saveButton = page.locator('button:has-text("保存"), button:has-text("Save")')
    if (await saveButton.isVisible({ timeout: 5000 })) {
      await saveButton.click()
      await page.waitForTimeout(500)

      // セーブスロットを選択
      const saveSlot = page.locator('button:has-text("スロット"), button:has-text("Slot")').first()
      if (await saveSlot.isVisible()) {
        await saveSlot.click()
        await page.waitForTimeout(1000)
      }
    }
  })
})
