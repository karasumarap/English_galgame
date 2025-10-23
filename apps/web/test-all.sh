#!/bin/bash

echo "=================================="
echo "🧪 テスト総合レポート"
echo "=================================="
echo ""

echo "📋 1. 型チェック (tsc --noEmit)"
echo "----------------------------------"
pnpm type-check
TYPE_CHECK_RESULT=$?
echo ""

echo "📋 2. Lint (eslint)"
echo "----------------------------------"
pnpm lint
LINT_RESULT=$?
echo ""

echo "📋 3. ユニット・コンポーネントテスト (vitest)"
echo "----------------------------------"
pnpm test run
TEST_RESULT=$?
echo ""

echo "📋 4. カバレッジチェック (vitest coverage)"
echo "----------------------------------"
pnpm test:coverage
COVERAGE_RESULT=$?
echo ""

echo "📋 5. 型カバレッジ (type-coverage)"
echo "----------------------------------"
pnpm type-coverage
TYPE_COV_RESULT=$?
echo ""

echo "=================================="
echo "📊 結果サマリー"
echo "=================================="
echo ""

if [ $TYPE_CHECK_RESULT -eq 0 ]; then
  echo "✅ 型チェック: PASS"
else
  echo "❌ 型チェック: FAIL"
fi

if [ $LINT_RESULT -eq 0 ]; then
  echo "✅ Lint: PASS"
else
  echo "❌ Lint: FAIL"
fi

if [ $TEST_RESULT -eq 0 ]; then
  echo "✅ ユニットテスト: PASS"
else
  echo "❌ ユニットテスト: FAIL"
fi

if [ $COVERAGE_RESULT -eq 0 ]; then
  echo "✅ カバレッジ (≥90%): PASS"
else
  echo "❌ カバレッジ (≥90%): FAIL"
fi

if [ $TYPE_COV_RESULT -eq 0 ]; then
  echo "✅ 型カバレッジ (≥90%): PASS"
else
  echo "❌ 型カバレッジ (≥90%): FAIL"
fi

echo ""
echo "=================================="

# 全体の結果判定
if [ $TYPE_CHECK_RESULT -eq 0 ] && [ $LINT_RESULT -eq 0 ] && [ $TEST_RESULT -eq 0 ] && [ $COVERAGE_RESULT -eq 0 ] && [ $TYPE_COV_RESULT -eq 0 ]; then
  echo "🎉 すべてのテストが成功しました!"
  exit 0
else
  echo "⚠️  一部のテストが失敗しました"
  exit 1
fi
