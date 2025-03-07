# **Capstone**
> 실시간 출퇴근 추적 시스템 (RATs)

[🎥 시연영상](https://drive.google.com/file/d/1mXTXmRcwW_hUl8scTNMFR0lXF4T01Vt_/view?usp=drive_link)

## **👨‍👩‍👧 팀원 구성**
#### 팀장 : 강세훈 (20173037)
#### 팀원 : 주영은 (20203093)

---

# **🌟 프로젝트 소개**

> 본 프로젝트는 기존의 출퇴근 시스템의 단점인 수동 태그 분실, 출퇴근 웹/앱 접속 등을 개선하고자 시작되었습니다.
>
> 시스템의 주요 특징은 사용자 편의성을 개선하고 실시간 모니터링을 통해 시스템의 성능을 최적화하는 것입니다. RATs를 활용하여 사용자의 활동과 단말기의 정보를 실시간으로 수집하고 분석합니다.
>
> 특히, 0.07ms 이내의 접속지연이 확인되었으며, 10명 이하의 소규모 시험결과 안정적인 성능을 보여주었습니다. 
>
> 또한 자체적인 EAP 모듈을 이용해 보안성을 강화하고, 시스템의 효율성과 안정성을 동시에 확보하였습니다.


### **🗓 프로젝트 기간**

📅 2022.12 ~ 2023.04

---

## **⚙ 기술 스택**

### Frontend

<img src="https://img.shields.io/badge/html5-E34F26?style=for-the-badge&logo=html5&logoColor=white"> <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=CSS3&logoColor=white">

### Backend

<img src="https://img.shields.io/badge/express-000000?style=for-the-badge&logo=express&logoColor=white"> <img src="https://img.shields.io/badge/node.js-5FA04E?style=for-the-badge&logo=node.js&logoColor=white">

### Database

<img src="https://img.shields.io/badge/mysql-4479A1?style=for-the-badge&logo=mysql&logoColor=white"> <img src="https://img.shields.io/badge/-goorm-303237?style=for-the-badge&logo=&logoColor=white" height="30" alt="goorm logo"  />

### ETC

<img src="https://img.shields.io/badge/apachekafka-231F20?style=for-the-badge&logo=apachekafka&logoColor=white"> <img src="https://img.shields.io/badge/C-A8B9CC?style=for-the-badge&logo=C&logoColor=white"> 

---
 
## **💡 역할**
### 주영은
- Frontend
  - 로그인 및 회원가입 페이지 제작
  - 관리자 페이지 제작
    - 근로자 리스트 세션 구현
    - 근로자 일일 패킷 세션 구현 (office Hour 기준 지각-빨간색, 정시출근-파란색 표시)
    - 근로자 일일 패킷 그래프 구현 (Chart.js)
    - 근로자 월별 패킷 그래프 구현 (Chart.js)
 
- Backend
  - goorm.io 사용해 외부 접속 가능한 Mysql db 생성
  - DB 모델링
    - 관리자 테이블
    - 패킷 테이블
  - 패킷
    - 패킷 추가 API
    - 패킷 조회 API (날짜별, 근로자별 필터링 제공)
    - 인덱싱을 위해 6개월 기준으로 .cvs 파일 제공 및 데이터 초기화
  - 사용자
    - 관리자 회원가입 및 로그인 API
    - 근로자 추가 API
    - 근로자 삭제 API
 
---
 
## **🚀 주요 기능**
- 근로자 검색 기능
  - 근로자 이름 기준으로 검색 가능
 
- 근로자 리스트 확인
  - 근로자 추가 및 삭제
  - 근로자 선택 가능

- 일별 패킷 로그 확인 리스트
  - 날짜별로 해당 근로자의 패킷 로그를 확인
 
- 월별 패킷 로그 요약
  - 패킷 정보를 한달 요약한 그래프 제공

- 시간대별 패킷 그래프
  - ofiice-hour 기준으로 패킷을 한눈에 확인 가능


## **🔗 링크**

- [📄 PPT](https://github.com/user-attachments/files/18391744/_20173037._20203093.pptx)
- [📄 프로젝트 요약](https://github.com/user-attachments/files/18391785/_.pdf)

