#!/bin/bash
if [ -f "hw5/FIX_DATABASE_URL.md" ]; then
  sed -i "s/215257223815-uo4cl5tfim41o3fonv557li0mv9245a0\.apps\.googleusercontent\.com/your-google-client-id/g" hw5/FIX_DATABASE_URL.md
  sed -i "s/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/your-google-client-secret/g" hw5/FIX_DATABASE_URL.md
fi
if [ -f "hw5/UPDATE_ENV_LOCAL.md" ]; then
  sed -i "s/215257223815-uo4cl5tfim41o3fonv557li0mv9245a0\.apps\.googleusercontent\.com/your-google-client-id/g" hw5/UPDATE_ENV_LOCAL.md
  sed -i "s/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/your-google-client-secret/g" hw5/UPDATE_ENV_LOCAL.md
fi

