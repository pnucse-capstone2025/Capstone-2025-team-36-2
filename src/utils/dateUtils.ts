/**
 * 날짜 관련 유틸리티 함수들
 * 시간대 문제를 해결하기 위한 로컬 날짜 처리
 */

/**
 * Date 객체를 로컬 시간대 기준으로 YYYY-MM-DD 형식의 문자열로 변환
 * toISOString() 대신 로컬 시간대를 사용하여 시간대 문제를 방지
 */
export const formatDateToLocalString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * YYYY-MM-DD 형식의 문자열을 로컬 시간대 기준으로 Date 객체로 변환
 */
export const parseLocalDateString = (dateString: string): Date => {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
};

/**
 * 두 날짜가 같은 날인지 확인 (시간대 무관)
 */
export const isSameDay = (date1: Date, date2: Date): boolean => {
  return formatDateToLocalString(date1) === formatDateToLocalString(date2);
};

/**
 * 현재 날짜를 로컬 시간대 기준으로 YYYY-MM-DD 형식으로 반환
 */
export const getCurrentLocalDateString = (): string => {
  return formatDateToLocalString(new Date());
};

/**
 * Date 객체를 한국어 형식으로 포맷팅 (예: 2024년 9월 15일)
 */
export const formatDateToKorean = (date: Date): string => {
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};
