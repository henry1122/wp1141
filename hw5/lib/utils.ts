import { formatDistanceToNow } from 'date-fns'

export function formatTimeAgo(date: Date): string {
  const distance = formatDistanceToNow(new Date(date), { addSuffix: true })
  
  // Convert to Chinese format if needed, or keep English
  if (distance.includes('less than a minute')) return '剛剛'
  if (distance.includes('minute')) return distance.replace('minutes', '分鐘').replace('minute', '分鐘') + '前'
  if (distance.includes('hour')) return distance.replace('hours', '小時').replace('hour', '小時') + '前'
  if (distance.includes('day')) return distance.replace('days', '天').replace('day', '天') + '前'
  if (distance.includes('month')) return distance.replace('months', '個月').replace('month', '個月') + '前'
  if (distance.includes('year')) return distance.replace('years', '年').replace('year', '年') + '前'
  
  return distance
}

export function extractUrls(text: string): string[] {
  const urlRegex = /(https?:\/\/[^\s]+)/g
  return text.match(urlRegex) || []
}

export function extractHashtags(text: string): string[] {
  const hashtagRegex = /#\w+/g
  return text.match(hashtagRegex) || []
}

export function extractMentions(text: string): string[] {
  const mentionRegex = /@\w+/g
  return text.match(mentionRegex) || []
}

export function calculatePostLength(content: string): number {
  const urls = extractUrls(content)
  const hashtags = extractHashtags(content)
  const mentions = extractMentions(content)
  
  // Start with the original content
  let baseContent = content
  
  // Remove URLs first (they will be counted as 23 chars each)
  urls.forEach(url => {
    baseContent = baseContent.replace(url, '')
  })
  
  // Remove hashtags and mentions (they don't count toward limit)
  hashtags.forEach(tag => {
    baseContent = baseContent.replace(tag, '')
  })
  mentions.forEach(mention => {
    baseContent = baseContent.replace(mention, '')
  })
  
  baseContent = baseContent.trim()
  
  // Calculate length: base content + 23 chars per URL
  let length = baseContent.length
  urls.forEach(() => {
    length += 23
  })
  
  return length
}

export function formatPostContent(content: string): string {
  let formatted = content
  
  // Replace URLs with links
  const urls = extractUrls(content)
  urls.forEach(url => {
    formatted = formatted.replace(url, `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">${url}</a>`)
  })
  
  // Replace mentions with links (will be handled by component)
  // Replace hashtags with styled spans
  const hashtags = extractHashtags(content)
  hashtags.forEach(tag => {
    formatted = formatted.replace(tag, `<span class="text-primary">${tag}</span>`)
  })
  
  return formatted
}


