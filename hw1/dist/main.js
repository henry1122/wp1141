// CV Data Types and Interfaces
// CV Data (Customize this section with your information)
const cvData = {
    personal: {
        name: "章宏瑞",
        title: "電機工程學系學生 | EDA 與數位設計專長",
        summary: "目前專精於 EDA 工具開發與數位電路設計，具備些許FPGA的開發經驗，近期致力於研究SAT問題方面的知識與技術。",
        email: "hrjhang1122@gmail.com",
        phone: "+886-966-586-065",
        location: "台灣新竹縣",
        linkedin: "https://www.facebook.com/hocashi.chang",
        profilePhoto: "personal picture.jpg"
    },
    
    experience: [
		{
            title: "專題生",
            company: "Design Verification Lab",
            period: "2025年7月 - ",
            description: "研究SAT問題與演算法策略，未來協助數位電路設計與驗證流程優化。",
            achievements: [
				
            ]
        },
        {
            title: "專題生",
            company: "網路資訊與通信實驗室 (Networked Information and Communications Lab)",
            period: "2024年7月 - 2025年6月",
            description: "研究THz通信技術以及計算在干擾與屏蔽的情形下之通道容量",
            achievements: [
                "Coverage for 3D Terahertz Communication Systems",
                "Capacity and Outage Analysis of Bursty Channels",
                "Capacity and Interference in Multi-User 3D THz Communication : An Information Perspective"
            ]
        },
        {
            title: "專題生",
            company: "Microsystem Research Lab (MSRL)",
            period: "2024年2月 - 2024年6月",
            description: "協助教授進行數位電路設計研究，專注於低功耗設計技術。",
            achievements: [
                "Network Quantization & PE Array Design",
                "5G MIMO Demodulation",
            ]
        }
    ],
    
    education: [
        {
            degree: "電機工程學系學士",
            institution: "國立台灣大學",
            period: "2023年9月 - ",
            description: "主修電機工程，目前專精於數位設計與 EDA 工具應用，也修習相關數學系課程",
            gpa: "4.16/4.3"
        }
    ],
    
    projects: [
        {
            title: "Network Quantization & PE Array Design & 5G MIMO Demodulation",
            description: "數位電路設計與5G MIMO通信系統設計",
            url: "some_pdf/專題研究報告.pdf",
            tags: ["Digital Design", "5G MIMO", "Network Quantization", "PE Array Design"],
            status: "完成"
        },
        {
            title: "Coverage for 3D Terahertz Communication Systems",
            description: "3D Terahertz通信系統的覆蓋分析",
            url: "some_pdf/THz_Coverage (1).pdf",
            tags: ["3D Terahertz Communication", "Coverage Analysis"],
            status: "完成"
        },
        {
            title: "Capacity and Outage Analysis of Bursty Channels",
            description: "Bursty通道的容量與 outage 分析",
            url: "some_pdf/Brust.pdf",
            tags: ["Bursty Channels", "Capacity Analysis", "Outage Analysis"],
            status: "完成"
        },
        {
            title: "Capacity and Interference in Multi-User 3D THz Communication : An Information Perspective",
            description: "多用戶3D Terahertz通信的容量與干擾分析",
            url: "some_pdf/Interference_THz_MAC.pdf",
            tags: ["3D Terahertz Communication", "Capacity Analysis", "Interference Analysis"],
            status: "完成"
        }
    ],
    
    skills: [
        {
            category: "程式語言",
            items: ["Python", "C++", "Verilog", "VHDL", "TypeScript", "JavaScript"]
        },
        {
            category: "EDA 工具",
            items: ["Quartus", "Minisat"]
        },
        {
            category: "前端技術",
            items: ["HTML", "CSS", "Canvas"]
        },
        {
            category: "硬體設計",
            items: ["FPGA", "ASIC", "數位電路設計", "時序分析", "低功耗設計"]
        },
        {
            category: "其他工具",
            items: ["Linux", "MATLAB", "LaTeX", "Git"]
        }
    ],
    
    languages: [
        { name: "中文", level: "母語" },
        { name: "英文", level: "全民英檢中高級, TOEIC 900" },
        { name: "日文", level: "N3" }
    ],
    
    certifications: [
        {
            name: "電磁學考試中高級",
            reward: "特優",
            date: "2025年"
        },
    ],
    
    interests: ["旅遊", "跑步", "爬山", "彈鋼琴", "打球", "攝影", "閱讀"],
    
    // English versions
    english: {
        personal: {
            name: "Hong-Rui Chang",
            title: "Electrical Engineering Student | EDA & Digital Design Specialist",
            summary: "Currently specializing in EDA tool development and digital circuit design, with some FPGA development experience. Recently focused on researching SAT problem knowledge and techniques.",
            email: "hrjhang1122@gmail.com",
            phone: "+886-966-586-065",
            location: "Hsinchu County, Taiwan",
            linkedin: "https://www.facebook.com/hocashi.chang",
            profilePhoto: "personal picture.jpg"
        },
        
        experience: [
            {
                title: "Research Assistant",
                company: "Design Verification Lab",
                period: "July 2025 - Present",
                description: "Researching SAT problems and algorithmic strategies, future assistance in digital circuit design and verification process optimization.",
                achievements: []
            },
            {
                title: "Research Assistant",
                company: "Networked Information and Communications Lab",
                period: "July 2024 - June 2025",
                description: "Research on THz communication technology and channel capacity calculation under interference and shielding conditions.",
                achievements: [
                    "Coverage for 3D Terahertz Communication Systems",
                    "Capacity and Outage Analysis of Bursty Channels",
                    "Capacity and Interference in Multi-User 3D THz Communication: An Information Perspective"
                ]
            },
            {
                title: "Research Assistant",
                company: "Microsystem Research Lab (MSRL)",
                period: "February 2024 - June 2024",
                description: "Assisted professor in digital circuit design research, focusing on low-power design techniques.",
                achievements: [
                    "Network Quantization & PE Array Design",
                    "5G MIMO Demodulation"
                ]
            }
        ],
        
        education: [
            {
                degree: "Bachelor of Electrical Engineering",
                institution: "National Taiwan University",
                period: "September 2021 - June 2025",
                description: "Major in Electrical Engineering, specializing in digital design and EDA tool applications",
                gpa: "3.8/4.0"
            }
        ],
        
        projects: [
            {
                title: "Network Quantization & PE Array Design & 5G MIMO Demodulation",
                description: "Digital circuit design and 5G MIMO communication system design",
                url: "some_pdf/專題研究報告.pdf",
                tags: ["Digital Design", "5G MIMO", "Network Quantization", "PE Array Design"],
                status: "Completed"
            },
            {
                title: "Coverage for 3D Terahertz Communication Systems",
                description: "Coverage analysis for 3D Terahertz communication systems",
                url: "some_pdf/THz_Coverage (1).pdf",
                tags: ["3D Terahertz Communication", "Coverage Analysis"],
                status: "Completed"
            },
            {
                title: "Capacity and Outage Analysis of Bursty Channels",
                description: "Capacity and outage analysis of bursty channels",
                url: "some_pdf/Brust.pdf",
                tags: ["Bursty Channels", "Capacity Analysis", "Outage Analysis"],
                status: "Completed"
            },
            {
                title: "Capacity and Interference in Multi-User 3D THz Communication: An Information Perspective",
                description: "Capacity and interference analysis in multi-user 3D Terahertz communication",
                url: "some_pdf/Interference_THz_MAC.pdf",
                tags: ["3D Terahertz Communication", "Capacity Analysis", "Interference Analysis"],
                status: "Completed"
            }
        ],
        
        skills: [
            {
                category: "Programming Languages",
                items: ["TypeScript", "JavaScript", "Python", "C++", "Verilog", "VHDL"]
            },
            {
                category: "EDA Tools",
                items: ["Cadence", "Synopsys", "Xilinx Vivado", "Quartus", "ModelSim"]
            },
            {
                category: "Frontend Technologies",
                items: ["HTML5", "CSS3", "React", "Vue.js", "Webpack", "Canvas"]
            },
            {
                category: "Hardware Design",
                items: ["FPGA", "ASIC", "Digital Circuit Design", "Timing Analysis", "Low Power Design"]
            },
            {
                category: "Other Tools",
                items: ["Git", "Docker", "Linux", "MATLAB", "LaTeX", "Overleaf"]
            }
        ],
        
        languages: [
            { name: "Chinese", level: "Native" },
            { name: "English", level: "Fluent (TOEIC 850)" },
            { name: "Japanese", level: "Basic (N3)" }
        ],
        
        certifications: [
            {
                name: "FPGA Design Certification",
                issuer: "Xilinx",
                date: "2023"
            },
            {
                name: "Digital Circuit Design Certificate",
                issuer: "Taiwan IC Design Society",
                date: "2022"
            }
        ],
        
        interests: ["Travel", "Running", "Hiking", "Piano", "Sports", "Photography", "Reading"]
    }
};

// Utility Functions
const select = (selector) => {
    const el = document.querySelector(selector);
    if (!el) throw new Error(`Element not found: ${selector}`);
    return el;
};

const formatYear = (d) => String(d.getFullYear());

// Main Application
function initializeCV() {
    // Set current year
    const yearEl = select("#year");
	yearEl.textContent = formatYear(new Date());
    
    // Populate personal information
    populatePersonalInfo();
    
    // Populate sections
    populateExperience();
    populateEducation();
    populateProjects();
    populateSkills();
    populateLanguages();
    populateCertifications();
    populateInterests();
    populatePhotoGalleries();
    
    // Initialize interactions
    initializeLanguageToggle();
    initializeBackgroundToggle();
    initializeThemeToggle();
    initializePrintFunction();
    initializeContactForm();
    initializePhotoModal();
}

function populatePersonalInfo() {
    const { personal } = cvData;
    
    // Update header information
    const nameEl = select("#name");
    if (!(nameEl.textContent || '').trim()) nameEl.textContent = personal.name;

    const emailEl = select("#email");
    if (!(emailEl.textContent || '').trim()) emailEl.textContent = personal.email;

    const phoneEl = select("#phone");
    if (!(phoneEl.textContent || '').trim()) phoneEl.textContent = personal.phone;

    const locationEl = select("#location");
    if (!(locationEl.textContent || '').trim()) locationEl.textContent = personal.location;

    const linkedinEl = select("#linkedin");
    const href = linkedinEl.getAttribute("href") || "";
    const isHttp = /^https?:\/\//i.test(href);
    if (!isHttp) {
        linkedinEl.href = personal.linkedin;
    }

    // Set profile photo
    const profilePhotoEl = select("#profile-photo");
    if (personal.profilePhoto) {
        profilePhotoEl.src = personal.profilePhoto;
        
        // Add click event for profile photo
        profilePhotoEl.addEventListener('click', () => {
            const profilePhotoData = [{
                src: personal.profilePhoto,
                alt: personal.name,
                category: "個人照片"
            }];
            window.openPhotoModal(personal.profilePhoto, "個人照片", profilePhotoData);
        });
    }
}

function populateExperience() {
    const container = select("#experience-list");
    const fragment = document.createDocumentFragment();
    
    cvData.experience.forEach(exp => {
        const item = document.createElement("div");
        item.className = "timeline-item";
        
        item.innerHTML = `
            <h3>${exp.title}</h3>
            <div class="company">${exp.company}</div>
            <div class="period">${exp.period}</div>
            <div class="description">${exp.description}</div>
            ${exp.achievements ? `
                <ul style="margin-top: 10px; padding-left: 20px;">
                    ${exp.achievements.map(achievement => `<li>${achievement}</li>`).join('')}
                </ul>
            ` : ''}
        `;
        
        fragment.appendChild(item);
    });
    
    container.appendChild(fragment);
}

function populateEducation() {
    const container = select("#education-list");
    const fragment = document.createDocumentFragment();
    
    cvData.education.forEach(edu => {
        const item = document.createElement("div");
        item.className = "timeline-item";
        
        item.innerHTML = `
            <h3>${edu.degree}</h3>
            <div class="company">${edu.institution}</div>
            <div class="period">${edu.period}${edu.gpa ? ` | GPA: ${edu.gpa}` : ''}</div>
            ${edu.description ? `<div class="description">${edu.description}</div>` : ''}
        `;
        
        fragment.appendChild(item);
    });
    
    container.appendChild(fragment);
}

function populateProjects() {
    const container = select("#projects-list");
    const fragment = document.createDocumentFragment();
    
    cvData.projects.forEach(project => {
        const item = document.createElement("div");
        item.className = "project-item";
        
        item.innerHTML = `
            <h3>${project.title}${project.status ? ` <span style="font-size: 0.8em; color: var(--text-light);">(${project.status})</span>` : ''}</h3>
            <div class="description">${project.description}</div>
            <div class="tags">
                ${project.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')}
            </div>
            ${project.url ? `<div style="margin-top: 10px;"><a href="${project.url}" target="_blank" rel="noopener noreferrer">查看專案 →</a></div>` : ''}
        `;
        
        fragment.appendChild(item);
    });
    
    container.appendChild(fragment);
}

function populateSkills() {
    const container = select("#skills-list");
    const fragment = document.createDocumentFragment();
    
    cvData.skills.forEach(skill => {
        const category = document.createElement("div");
        category.className = "skill-category";
        
        category.innerHTML = `
            <h4>${skill.category}</h4>
            <div class="skill-items">
                ${skill.items.map(item => `<span class="skill-item">${item}</span>`).join('')}
            </div>
        `;
        
        fragment.appendChild(category);
    });
    
    container.appendChild(fragment);
}

function populateLanguages() {
    const container = select("#languages-list");
    const fragment = document.createDocumentFragment();
    
    cvData.languages.forEach(lang => {
        const item = document.createElement("div");
        item.className = "language-item";
        
        item.innerHTML = `
            <span class="language-name">${lang.name}</span>
            <span class="language-level">${lang.level}</span>
        `;
        
        fragment.appendChild(item);
    });
    
    container.appendChild(fragment);
}

function populateCertifications() {
    const container = select("#certifications-list");
    const fragment = document.createDocumentFragment();
    
    cvData.certifications.forEach(cert => {
        const item = document.createElement("div");
        item.className = "cert-item";
        
        item.innerHTML = `
            <h4>${cert.name}</h4>
            <div class="issuer">${cert.issuer}${cert.date ? ` • ${cert.date}` : ''}</div>
        `;
        
        fragment.appendChild(item);
    });
    
    container.appendChild(fragment);
}

function populateInterests() {
    const container = select("#interests-list");
    const fragment = document.createDocumentFragment();
    
    cvData.interests.forEach(interest => {
        const item = document.createElement("span");
        item.className = "interest-item";
        item.textContent = interest;
        fragment.appendChild(item);
    });
    
    container.appendChild(fragment);
}

function populatePhotoGalleries() {
    // Friends photos - 所有朋友生活照片
    const friendsPhotos = [
        "07591704-b9cc-4b82-9132-f249fe5b0b40.jpg",
        "096fd842-1737-41d2-b2e6-17b5d51860f0.jpg",
        "17eb1c74-7a1f-43f4-811c-01ec2e8d2768.jpg",
        "5f2836bf-c546-43d5-89f3-d383c01c5fb8.jpg",
        "9c2a354e-6a15-46c7-aba1-a755ea188086.jpg",
        "9d3dd558-730f-4b80-aa4a-b092f0f2c387.jpg",
        "fed4495b-3075-4c42-8206-ef0a247e64ec.jpg"
    ];
    
    // Mountain photos - 所有登山健行照片
    const mountainPhotos = [
        "056e2a7e-76d9-497b-a495-c8494991d5bc.jpg",
        "1cb72b7e-b28f-4550-b0c4-308f1a283c5a.jpg",
        "2cdd0eda-7831-4537-befd-0dc7db5f5deb.jpg",
        "373ddcd6-9d6e-43bb-b6ae-4795bfff25b7.jpg",
        "492f9bc8-4c59-4e2c-90fb-b5ecaf412aa5.jpg",
        "53e8cd04-0811-4c29-a392-3299ff635950.jpg",
        "5652b56f-ddd6-4a92-bb3a-3c9c9da34eb6.jpg",
        "5941952a-7651-4ee4-ad39-b0557666de35.jpg",
        "5cae16cf-fbea-47dc-a211-037484c1ca0a.jpg",
        "70e18712-c897-4ca3-b56e-ea8c4ffd623e.jpg",
        "778ff8ae-9fc4-4db8-8ff9-aec61c98afd6.jpg",
        "898ffb66-625d-42c8-aa53-ab07e2ea2213.jpg",
        "a0a4c4fe-d11f-43a7-a234-fdf7a8965ffc.jpg",
        "a7c00f92-562e-4df9-a221-6bdd266d99b1.jpg",
        "ae79eb20-fc02-4ebe-99c3-1464a43c4f4b.jpg",
        "d28bcf55-93e9-4694-a46e-c827ffe728c6.jpg",
        "df878185-0a23-4305-931f-0b1c965fdaf1.jpg",
        "e1397f20-66d9-412c-9935-478fefecce8c.jpg",
        "fd856b07-e847-4c5d-9001-c959d9b08144.jpg",
        "fe2b9288-d3a8-4df9-9c9a-787ff6802fdc.jpg"
    ];
    
    // Food photos - 所有美食照片
    const foodPhotos = [
        "323656bc-1e7e-4c36-b804-360d0fbb0b4c.jpg",
        "4b5e21ab-af77-4173-ae02-10c643a74292.jpg",
        "673f04f4-dcae-44d9-a6eb-a5d801eb8666.jpg",
        "6f1669a1-193b-4b05-9979-5776afe7e45b.jpg",
        "6f2c2f9e-ece0-4cfa-ad04-b59e6ea9f1d1.jpg",
        "83da94b8-b575-4e64-8e60-8ba0c1423857.jpg",
        "93cc2382-21f6-4f64-8fb9-4a5ae6b89301.jpg",
        "b2b34aea-addd-4288-b4b0-5926751ef980.jpg",
        "c558b7dc-b956-4152-a193-c11ad0b4ca49.jpg",
        "e1f9059a-ac7c-465c-99f4-84f178153e63.jpg",
        "e7c53168-629b-4d16-80c9-fd695b5c705e.jpg",
        "f3baf0ec-d353-4d15-a197-af201b7a79f4.jpg"
    ];
    
    // Travel photos - 所有旅行照片
    const travelPhotos = [
        "00ff317d-41f1-47ee-9c45-65875e23dec3.jpg",
        "37f58b6e-be51-4c38-8872-d51b71f31224.jpg",
        "39520572-559f-4ceb-92d2-959d6871112b.jpg",
        "3efd893d-31df-4588-9ae3-5e9a053bec13.jpg",
        "4730ade0-7964-4c90-a331-4eb6281065a4.jpg",
        "4793c4e4-634d-4203-92f8-0f0f9cf73f05.jpg",
        "6509ee31-c2ce-4e8f-bb49-5837f125a57b.jpg",
        "6e886499-18c5-4ce4-98f3-fef211c18e11.jpg",
        "907f1196-c99d-412a-a433-614e5fb1ece6.jpg",
        "c3168828-7748-4789-bb4b-2708a2db81ef.jpg",
        "c465eeab-30ef-4844-b785-3d7e9cf4c9fc.jpg",
        "cb007138-f61f-45de-964a-37f6569e2ab6.jpg"
    ];
    
    // Populate each gallery
    populateGallery("friends-gallery", friendsPhotos, "朋友&生活");
    populateGallery("mountain-gallery", mountainPhotos, "登山健行");
    populateGallery("food-gallery", foodPhotos, "美食專區");
    populateGallery("travel-gallery", travelPhotos, "輕度旅行");
}

function populateGallery(galleryId, photos, categoryName) {
    const container = document.getElementById(galleryId);
    if (!container) return;
    
    const fragment = document.createDocumentFragment();
    
    // Prepare all photos for modal
    const allPhotos = [];
    
    photos.forEach((photo, index) => {
        const item = document.createElement("div");
        item.className = "gallery-item";
        item.style.setProperty('--gallery-delay', index);
        
        const folderName = categoryName === '朋友&生活' ? 'Friends life' : 
                          categoryName === '登山健行' ? 'mountain' : 
                          categoryName === '美食專區' ? 'Food' : 'Travel';
        
        const photoSrc = `some_picture/${folderName}/${photo}`;
        
        // Add to all photos array
        allPhotos.push({
            src: photoSrc,
            alt: categoryName,
            category: categoryName
        });
        
        item.innerHTML = `
            <img src="${photoSrc}" 
                 alt="${categoryName}" class="gallery-photo" 
                 onerror="this.style.display='none'">
            <div class="gallery-overlay">
                <span>${categoryName}</span>
            </div>
        `;
        
        // Add click event
        item.addEventListener('click', () => {
            window.openPhotoModal(photoSrc, categoryName, allPhotos);
        });
        
        // Add cursor pointer style
        item.style.cursor = 'pointer';
        
        fragment.appendChild(item);
    });
    
    container.appendChild(fragment);
}

function initializeLanguageToggle() {
    const toggle = select("#language-toggle");
    const languageKey = "cv-language";
    
    const applyLanguage = (isEnglish) => {
        if (isEnglish) {
            // Switch to English
            toggle.textContent = "🌐 English";
            document.documentElement.lang = "en";
            
            // Update all content to English
            updateAllContent(true);
        } else {
            // Switch to Chinese
            toggle.textContent = "🌐 中文";
            document.documentElement.lang = "zh-Hant";
            
            // Update all content to Chinese
            updateAllContent(false);
        }
        
        localStorage.setItem(languageKey, String(isEnglish));
    };
    
    const savedLanguage = localStorage.getItem(languageKey) === "true";
    applyLanguage(savedLanguage);
    
    toggle.addEventListener("click", () => {
        const isCurrentlyEnglish = toggle.textContent.includes("English");
        applyLanguage(!isCurrentlyEnglish);
    });
}

function updateSectionTitles(isEnglish) {
    const sectionTitles = {
        experience: isEnglish ? "🔬 Research Experience" : "🔬 研究經驗",
        education: isEnglish ? "🎓 Education" : "🎓 學歷背景",
        projects: isEnglish ? "💻 Projects" : "💻 專題作品",
        skills: isEnglish ? "⚡ Skills & Expertise" : "⚡ 技能與專長",
        languages: isEnglish ? "🌐 Languages" : "🌐 語言能力",
        certifications: isEnglish ? "🏆 Certifications & Competitions" : "🏆 證照與競賽經歷",
        interests: isEnglish ? "🎯 Interests & Hobbies" : "🎯 興趣與愛好",
        contact: isEnglish ? "📧 Contact" : "📧 聯絡資訊",
        gallery: isEnglish ? "📸 Life Gallery" : "📸 生活剪影"
    };
    
    Object.keys(sectionTitles).forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) {
            const titleEl = section.querySelector(".section-title");
            if (titleEl) {
                titleEl.textContent = sectionTitles[sectionId];
            }
        }
    });
}

function updateContactInfo(isEnglish) {
    const contactItems = document.querySelectorAll(".contact-item");
    contactItems.forEach(item => {
        const icon = item.querySelector(".icon");
        const text = item.querySelector("span:not(.icon)");
        if (icon && text) {
            const iconText = icon.textContent;
            if (iconText === "📍") {
                text.textContent = isEnglish ? "Hsinchu County, Taiwan" : "台灣新竹縣";
            } else if (iconText === "🔗") {
                const link = item.querySelector("a");
                if (link) {
                    link.textContent = isEnglish ? "Facebook: hocashi chang" : "Facebook:hocashi chang";
                }
            }
        }
    });
}

function updateFooter(isEnglish) {
    const footerLinks = document.querySelectorAll(".footer-links a");
    const footerTexts = isEnglish ? [
        "Research Experience", "Education", "Projects", "Skills", "Contact Me"
    ] : [
        "研究經驗", "學歷背景", "專題作品", "技能與專長", "聯絡我"
    ];
    
    footerLinks.forEach((link, index) => {
        if (index < footerTexts.length) {
            link.textContent = footerTexts[index];
        }
    });
}

function updateAllContent(isEnglish) {
    const data = isEnglish ? cvData.english : cvData;
    
    // Update personal information
    const nameEl = select("#name");
    nameEl.textContent = data.personal.name;
    
    const titleEl = document.querySelector(".title");
    if (titleEl) {
        titleEl.textContent = data.personal.title;
    }
    
    const summaryEl = document.querySelector(".summary");
    if (summaryEl) {
        summaryEl.textContent = data.personal.summary;
    }
    
    // Update contact information
    updateContactInfo(isEnglish);
    
    // Update section titles
    updateSectionTitles(isEnglish);
    
    // Update footer
    updateFooter(isEnglish);
    
    // Update all sections with new data
    updateExperienceSection(data.experience);
    updateEducationSection(data.education);
    updateProjectsSection(data.projects);
    updateSkillsSection(data.skills);
    updateLanguagesSection(data.languages);
    updateCertificationsSection(data.certifications);
    updateInterestsSection(data.interests);
}

function updateExperienceSection(experienceData) {
    const container = select("#experience-list");
    container.innerHTML = "";
    
    const fragment = document.createDocumentFragment();
    
    experienceData.forEach(exp => {
        const item = document.createElement("div");
        item.className = "timeline-item";
        
        item.innerHTML = `
            <h3>${exp.title}</h3>
            <div class="company">${exp.company}</div>
            <div class="period">${exp.period}</div>
            <div class="description">${exp.description}</div>
            ${exp.achievements && exp.achievements.length > 0 ? `
                <ul style="margin-top: 10px; padding-left: 20px;">
                    ${exp.achievements.map(achievement => `<li>${achievement}</li>`).join('')}
                </ul>
            ` : ''}
        `;
        
        fragment.appendChild(item);
    });
    
    container.appendChild(fragment);
}

function updateEducationSection(educationData) {
    const container = select("#education-list");
    container.innerHTML = "";
    
    const fragment = document.createDocumentFragment();
    
    educationData.forEach(edu => {
        const item = document.createElement("div");
        item.className = "timeline-item";
        
        item.innerHTML = `
            <h3>${edu.degree}</h3>
            <div class="company">${edu.institution}</div>
            <div class="period">${edu.period}${edu.gpa ? ` | GPA: ${edu.gpa}` : ''}</div>
            ${edu.description ? `<div class="description">${edu.description}</div>` : ''}
        `;
        
        fragment.appendChild(item);
    });
    
    container.appendChild(fragment);
}

function updateProjectsSection(projectsData) {
    const container = select("#projects-list");
    container.innerHTML = "";
    
    const fragment = document.createDocumentFragment();
    
    projectsData.forEach(project => {
        const item = document.createElement("div");
        item.className = "project-item";
        
        item.innerHTML = `
            <h3>${project.title}${project.status ? ` <span style="font-size: 0.8em; color: var(--text-light);">(${project.status})</span>` : ''}</h3>
            <div class="description">${project.description}</div>
            <div class="tags">
                ${project.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')}
            </div>
            ${project.url ? `<div style="margin-top: 10px;"><a href="${project.url}" target="_blank" rel="noopener noreferrer">查看專案 →</a></div>` : ''}
        `;
        
        fragment.appendChild(item);
    });
    
    container.appendChild(fragment);
}

function updateSkillsSection(skillsData) {
    const container = select("#skills-list");
    container.innerHTML = "";
    
    const fragment = document.createDocumentFragment();
    
    skillsData.forEach(skill => {
        const category = document.createElement("div");
        category.className = "skill-category";
        
        category.innerHTML = `
            <h4>${skill.category}</h4>
            <div class="skill-items">
                ${skill.items.map(item => `<span class="skill-item">${item}</span>`).join('')}
            </div>
        `;
        
        fragment.appendChild(category);
    });
    
    container.appendChild(fragment);
}

function updateLanguagesSection(languagesData) {
    const container = select("#languages-list");
    container.innerHTML = "";
    
    const fragment = document.createDocumentFragment();
    
    languagesData.forEach(lang => {
        const item = document.createElement("div");
        item.className = "language-item";
        
        item.innerHTML = `
            <span class="language-name">${lang.name}</span>
            <span class="language-level">${lang.level}</span>
        `;
        
        fragment.appendChild(item);
    });
    
    container.appendChild(fragment);
}

function updateCertificationsSection(certificationsData) {
    const container = select("#certifications-list");
    container.innerHTML = "";
    
    const fragment = document.createDocumentFragment();
    
    certificationsData.forEach(cert => {
        const item = document.createElement("div");
        item.className = "cert-item";
        
        item.innerHTML = `
            <h4>${cert.name}</h4>
            <div class="issuer">${cert.issuer}${cert.date ? ` • ${cert.date}` : ''}</div>
        `;
        
        fragment.appendChild(item);
    });
    
    container.appendChild(fragment);
}

function updateInterestsSection(interestsData) {
    const container = select("#interests-list");
    container.innerHTML = "";
    
    const fragment = document.createDocumentFragment();
    
    interestsData.forEach(interest => {
        const item = document.createElement("span");
        item.className = "interest-item";
        item.textContent = interest;
        fragment.appendChild(item);
    });
    
    container.appendChild(fragment);
}

function initializeBackgroundToggle() {
    const toggle = select("#background-toggle");
    const backgroundKey = "cv-background";
    
    const backgrounds = [
        "bg-gradient-1", "bg-gradient-2", "bg-gradient-3", "bg-gradient-4",
        "bg-gradient-5", "bg-gradient-6", "bg-gradient-7", "bg-gradient-8"
    ];
    
    const backgroundNames = [
        "紫藍漸層", "粉紅漸層", "藍色漸層", "綠色漸層",
        "粉黃漸層", "青粉漸層", "粉紫漸層", "橙粉漸層"
    ];
    
    let currentIndex = 0;
    
    const applyBackground = (index) => {
        // Remove all background classes
        document.body.classList.remove(...backgrounds);
        
        // Add the selected background
        if (index >= 0 && index < backgrounds.length) {
            document.body.classList.add(backgrounds[index]);
            toggle.textContent = `🎨 ${backgroundNames[index]}`;
            currentIndex = index;
        } else {
            // Default background (no class)
            toggle.textContent = "🎨 背景";
            currentIndex = -1;
        }
        
        localStorage.setItem(backgroundKey, String(currentIndex));
    };
    
    const savedBackground = parseInt(localStorage.getItem(backgroundKey)) || -1;
    applyBackground(savedBackground);
    
    toggle.addEventListener("click", () => {
        const nextIndex = (currentIndex + 1) % (backgrounds.length + 1);
        if (nextIndex === backgrounds.length) {
            // Cycle back to default (no background)
            applyBackground(-1);
        } else {
            applyBackground(nextIndex);
        }
    });
}

function initializeThemeToggle() {
    const toggle = select("#theme-toggle");
    const themeKey = "cv-theme";
    
    const applyTheme = (isDark) => {
        document.body.classList.toggle("theme-dark", isDark);
        toggle.setAttribute("aria-pressed", String(isDark));
        localStorage.setItem(themeKey, String(isDark));
    };
    
    const savedTheme = localStorage.getItem(themeKey) === "true";
    applyTheme(savedTheme);
    
    toggle.addEventListener("click", () => {
        const isCurrentlyDark = document.body.classList.contains("theme-dark");
        applyTheme(!isCurrentlyDark);
    });
}

function initializePrintFunction() {
    const printBtn = select("#print-cv");
    
    printBtn.addEventListener("click", () => {
        window.print();
    });
}

function initializeContactForm() {
    const form = select("#contact-form");
    const inputName = select("#input-name");
    const inputEmail = select("#input-email");
    const inputMessage = select("#input-message");
    const counter = select("#message-counter");
    const status = select("#form-status");
    
    // Character counter
    const updateCounter = () => {
        const len = inputMessage.value.length;
        counter.textContent = `${len} / ${inputMessage.maxLength}`;
    };
    
	inputMessage.addEventListener("input", updateCounter);
	updateCounter();
    
    // Form validation and submission
    form.addEventListener("submit", (e) => {
		e.preventDefault();
		status.textContent = "";
        
        const errors = [];
        
        if (inputName.value.trim().length < 2) {
            errors.push("姓名至少需要 2 個字元");
        }
        
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputEmail.value)) {
            errors.push("請輸入有效的電子郵件地址");
        }
        
        if (inputMessage.value.trim().length === 0) {
            errors.push("請輸入訊息內容");
        }
        
		if (errors.length > 0) {
            status.textContent = "表單驗證失敗：" + errors.join("、");
            status.style.color = "var(--accent-color)";
            status.style.backgroundColor = "rgba(231, 76, 60, 0.1)";
            status.style.padding = "10px";
            status.style.borderRadius = "var(--border-radius)";
			return;
		}
        
        // Simulate form submission
        status.textContent = "訊息已成功送出！感謝您的來信，我會盡快回覆。";
        status.style.color = "var(--secondary-color)";
        status.style.backgroundColor = "rgba(52, 152, 219, 0.1)";
        status.style.padding = "10px";
        status.style.borderRadius = "var(--border-radius)";
        
        // Reset form
		form.reset();
		updateCounter();
        
        // Clear status after 5 seconds
        setTimeout(() => {
            status.textContent = "";
            status.style.backgroundColor = "";
        }, 5000);
    });
}

// Smooth scrolling for navigation links
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
		e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
	});
		}
        });
	});
}

// Scroll-triggered animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe all sections and timeline items
    document.querySelectorAll('.cv-section, .timeline-item, .project-item').forEach((el, index) => {
        el.style.animationPlayState = 'paused';
        el.style.setProperty('--section-delay', index);
        el.style.setProperty('--item-delay', index);
        el.style.setProperty('--project-delay', index);
        observer.observe(el);
    });
}

// Photo Modal functionality
let currentPhotoIndex = 0;
let currentPhotos = [];

function initializePhotoModal() {
    const modal = select("#photo-modal");
    const modalImage = select("#modal-image");
    const modalInfo = select("#modal-info");
    const modalClose = select("#modal-close");
    const modalPrev = select("#modal-prev");
    const modalNext = select("#modal-next");
    
    // Close modal
    modalClose.addEventListener("click", closeModal);
    modal.addEventListener("click", (e) => {
        if (e.target === modal) closeModal();
    });
    
    // Navigation
    modalPrev.addEventListener("click", () => navigatePhoto(-1));
    modalNext.addEventListener("click", () => navigatePhoto(1));
    
    // Keyboard navigation
    document.addEventListener("keydown", (e) => {
        if (!modal.classList.contains("show")) return;
        
        switch(e.key) {
            case "Escape":
                closeModal();
                break;
            case "ArrowLeft":
                navigatePhoto(-1);
                break;
            case "ArrowRight":
                navigatePhoto(1);
                break;
        }
    });
    
    function closeModal() {
        modal.classList.remove("show");
        document.body.style.overflow = "";
    }
    
    function navigatePhoto(direction) {
        currentPhotoIndex += direction;
        
        if (currentPhotoIndex < 0) {
            currentPhotoIndex = currentPhotos.length - 1;
        } else if (currentPhotoIndex >= currentPhotos.length) {
            currentPhotoIndex = 0;
        }
        
        showPhoto(currentPhotos[currentPhotoIndex]);
    }
    
    function showPhoto(photoData) {
        modalImage.src = photoData.src;
        modalImage.alt = photoData.alt;
        modalInfo.textContent = photoData.category;
        modal.classList.add("show");
        document.body.style.overflow = "hidden";
    }
    
    // Make functions globally accessible
    window.openPhotoModal = (photoSrc, category, allPhotos) => {
        currentPhotos = allPhotos;
        currentPhotoIndex = allPhotos.findIndex(photo => photo.src === photoSrc);
        showPhoto({ src: photoSrc, alt: category, category: category });
    };
}

// Initialize everything when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    initializeCV();
    initializeSmoothScrolling();
    initializeScrollAnimations();
});