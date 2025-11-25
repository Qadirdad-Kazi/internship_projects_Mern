const PDFDocument = require('pdfkit');
const fs = require('fs').promises;
const path = require('path');
const Resume = require('../models/Resume');
const { v4: uuidv4 } = require('uuid');

// Ensure temp directories exist
const ensureDirectories = async () => {
  const tempDir = path.join(__dirname, '../../temp');
  const pdfDir = path.join(tempDir, 'pdfs');
  
  try {
    await fs.mkdir(tempDir, { recursive: true });
    await fs.mkdir(pdfDir, { recursive: true });
  } catch (error) {
    console.error('Error creating directories:', error);
  }
};

const generatePDF = async (req, res) => {
  try {
    console.log('[PDF DEBUG] PDF generation request received for ID:', req.params.id);
    console.log('[PDF DEBUG] User ID:', req.user._id);
    console.log('[PDF DEBUG] User subscription:', req.user.subscription);
    
    const { id } = req.params;
    const userId = req.user._id;
    
    // Check if user can export PDF
    console.log('[PDF DEBUG] Checking PDF export permissions...');
    const canExport = req.user.canExportPDF();
    console.log('[PDF DEBUG] Can export PDF:', canExport);
    
    if (!canExport) {
      console.log('[PDF DEBUG] PDF export denied - limit reached');
      return res.status(403).json({
        status: 'error',
        message: 'PDF export limit reached for your subscription plan',
        limit: req.user.subscription.features.pdfExports
      });
    }
    
    console.log('[PDF DEBUG] Looking for resume with ID:', id, 'and userId:', userId);
    const resume = await Resume.findOne({
      _id: id,
      userId,
      isActive: true
    });
    
    console.log('[PDF DEBUG] Resume found:', !!resume);
    if (resume) {
      console.log('[PDF DEBUG] Resume title:', resume.title);
      console.log('[PDF DEBUG] Resume template:', resume.template);
    }
    
    if (!resume) {
      console.log('[PDF DEBUG] Resume not found - returning 404');
      return res.status(404).json({
        status: 'error',
        message: 'Resume not found'
      });
    }
    
    await ensureDirectories();
    
    // Generate unique filename
    const filename = `resume-${uuidv4()}.pdf`;
    const filepath = path.join(__dirname, '../../temp/pdfs', filename);
    
    console.log('[PDF DEBUG] Starting PDF generation...');
    console.log('[PDF DEBUG] Filename:', filename);
    console.log('[PDF DEBUG] Filepath:', filepath);
    
    // Create PDF based on template
    let pdfBuffer;
    try {
      console.log('[PDF DEBUG] Calling createPDFBuffer...');
      pdfBuffer = await createPDFBuffer(resume);
      console.log('[PDF DEBUG] PDF buffer created, size:', pdfBuffer?.length);
    } catch (pdfError) {
      console.error('[PDF DEBUG] Error in createPDFBuffer:', pdfError);
      throw pdfError;
    }
    
    // Save PDF to file
    await fs.writeFile(filepath, pdfBuffer);
    
    // Update resume download count
    await resume.incrementDownloads();
    
    // Set response headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${resume.title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    
    // Send the PDF
    res.send(pdfBuffer);
    
    // Clean up file after a delay
    setTimeout(async () => {
      try {
        await fs.unlink(filepath);
      } catch (error) {
        console.error('Error deleting temp PDF:', error);
      }
    }, 60000); // Delete after 1 minute
    
  } catch (error) {
    console.error('[PDF DEBUG] Generate PDF error:', error);
    console.error('[PDF DEBUG] Error message:', error.message);
    console.error('[PDF DEBUG] Error stack:', error.stack);
    
    res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to generate PDF',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

const previewPDF = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    
    const resume = await Resume.findOne({
      _id: id,
      userId,
      isActive: true
    });
    
    if (!resume) {
      return res.status(404).json({
        status: 'error',
        message: 'Resume not found'
      });
    }
    
    // Create PDF buffer for preview (without saving to file)
    const pdfBuffer = await createPDFBuffer(resume);
    
    // Set response headers for inline viewing
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline');
    res.setHeader('Content-Length', pdfBuffer.length);
    
    // Send the PDF for preview
    res.send(pdfBuffer);
    
  } catch (error) {
    console.error('Preview PDF error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to preview PDF',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const createPDFBuffer = async (resume) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ 
        size: 'A4',
        margins: { top: 50, bottom: 50, left: 50, right: 50 }
      });
      
      const buffers = [];
      
      doc.on('data', (chunk) => buffers.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', reject);
      
      // Generate PDF based on template
      console.log('[PDF DEBUG] Resume template:', resume.template);
      
      // Map frontend template names to backend generators
      let templateName = resume.template;
      if (templateName.includes('modern') || templateName.includes('professional')) {
        templateName = 'modern';
      } else if (templateName.includes('classic') || templateName.includes('executive')) {
        templateName = 'classic';
      } else if (templateName.includes('minimal') || templateName.includes('clean') || templateName.includes('simple')) {
        templateName = 'minimal';
      } else if (templateName.includes('creative') || templateName.includes('portfolio') || templateName.includes('design')) {
        templateName = 'creative';
      }
      
      console.log('[PDF DEBUG] Mapped template name:', templateName);
      
      switch (templateName) {
        case 'modern':
          console.log('[PDF DEBUG] Using modern template generator');
          generateModernTemplate(doc, resume);
          break;
        case 'classic':
          console.log('[PDF DEBUG] Using classic template generator');
          generateClassicTemplate(doc, resume);
          break;
        case 'minimal':
          console.log('[PDF DEBUG] Using minimal template generator');
          generateMinimalTemplate(doc, resume);
          break;
        case 'creative':
          console.log('[PDF DEBUG] Using creative template generator');
          generateCreativeTemplate(doc, resume);
          break;
        default:
          console.log('[PDF DEBUG] Using default (modern) template generator');
          generateModernTemplate(doc, resume);
      }
      
      doc.end();
      
    } catch (error) {
      reject(error);
    }
  });
};

const generateModernTemplate = (doc, resume) => {
  try {
    console.log('[PDF DEBUG] Starting modern template generation');
    console.log('[PDF DEBUG] Resume object keys:', Object.keys(resume));
    console.log('[PDF DEBUG] Personal info:', resume.personalInfo);
    console.log('[PDF DEBUG] Settings:', resume.settings);
    
    const { personalInfo = {}, experience = [], education = [], skills = {}, projects = [], certifications = [] } = resume;
    const settings = resume.settings || {};
    const theme = settings.theme || {};
    const primaryColor = theme.primaryColor || '#2563eb';
    const fontSize = theme.fontSize || 12;
  
  let yPosition = 70;
  
  // Header Section with colored background
  doc.rect(0, 0, doc.page.width, 120)
     .fill(primaryColor);
  
  // Personal Information
  doc.fillColor('white')
     .fontSize(24)
     .font('Helvetica-Bold')
     .text(personalInfo.fullName, 50, 30);
  
  doc.fontSize(14)
     .font('Helvetica')
     .text(personalInfo.email, 50, 60);
  
  if (personalInfo.phone) {
    doc.text(` | ${personalInfo.phone}`, { continued: true });
  }
  
  if (personalInfo.website) {
    doc.text(` | ${personalInfo.website}`, { continued: true });
  }
  
  yPosition = 140;
  
  // Professional Summary
  if (personalInfo.professionalSummary && resume.settings.sections.showProfessionalSummary) {
    yPosition = addSection(doc, 'Professional Summary', personalInfo.professionalSummary, yPosition, primaryColor, fontSize);
  }
  
  // Experience Section
  if (experience && experience.length > 0 && resume.settings.sections.showExperience) {
    yPosition = addSectionHeader(doc, 'Professional Experience', yPosition, primaryColor, fontSize);
    
    experience.forEach(exp => {
      yPosition = addExperienceEntry(doc, exp, yPosition, fontSize);
    });
  }
  
  // Education Section
  if (education && education.length > 0 && resume.settings.sections.showEducation) {
    yPosition = addSectionHeader(doc, 'Education', yPosition, primaryColor, fontSize);
    
    education.forEach(edu => {
      yPosition = addEducationEntry(doc, edu, yPosition, fontSize);
    });
  }
  
  // Skills Section
  if (skills && resume.settings.sections.showSkills) {
    yPosition = addSkillsSection(doc, skills, yPosition, primaryColor, fontSize);
  }
  
  // Projects Section
  if (projects && projects.length > 0 && resume.settings.sections.showProjects) {
    yPosition = addSectionHeader(doc, 'Projects', yPosition, primaryColor, fontSize);
    
    projects.forEach(project => {
      yPosition = addProjectEntry(doc, project, yPosition, fontSize);
    });
  }
  
  // Certifications Section
  if (certifications && certifications.length > 0 && resume.settings.sections.showCertifications) {
    yPosition = addSectionHeader(doc, 'Certifications', yPosition, primaryColor, fontSize);
    
    certifications.forEach(cert => {
      yPosition = addCertificationEntry(doc, cert, yPosition, fontSize);
    });
  }
  
  console.log('[PDF DEBUG] Modern template generation completed successfully');
  
  } catch (error) {
    console.error('[PDF DEBUG] Error in generateModernTemplate:', error);
    console.error('[PDF DEBUG] Error stack:', error.stack);
    throw new Error(`PDF generation failed: ${error.message}`);
  }
};

const generateClassicTemplate = (doc, resume) => {
  const { personalInfo, experience, education, skills, projects, certifications } = resume;
  const fontSize = resume.settings.theme.fontSize || 12;
  
  let yPosition = 70;
  
  // Header Section - Classic Style
  doc.fillColor('black')
     .fontSize(28)
     .font('Times-Bold')
     .text(personalInfo.fullName, 50, yPosition, { align: 'center' });
  
  yPosition += 40;
  
  // Contact Info
  const contactInfo = [personalInfo.email, personalInfo.phone, personalInfo.website].filter(Boolean).join(' | ');
  doc.fontSize(12)
     .font('Times-Roman')
     .text(contactInfo, 50, yPosition, { align: 'center' });
  
  yPosition += 30;
  
  // Add a line separator
  doc.moveTo(50, yPosition)
     .lineTo(doc.page.width - 50, yPosition)
     .stroke();
  
  yPosition += 20;
  
  // Continue with sections using classic styling...
  if (personalInfo.professionalSummary && resume.settings.sections.showProfessionalSummary) {
    yPosition = addSection(doc, 'OBJECTIVE', personalInfo.professionalSummary, yPosition, 'black', fontSize, 'Times-Bold');
  }
  
  if (experience && experience.length > 0 && resume.settings.sections.showExperience) {
    yPosition = addSectionHeader(doc, 'PROFESSIONAL EXPERIENCE', yPosition, 'black', fontSize, 'Times-Bold');
    experience.forEach(exp => {
      yPosition = addExperienceEntry(doc, exp, yPosition, fontSize, 'Times-Roman');
    });
  }
  
  // Continue with other sections...
};

const generateMinimalTemplate = (doc, resume) => {
  const { personalInfo, experience, education, skills } = resume;
  const fontSize = resume.settings.theme.fontSize || 11;
  
  let yPosition = 70;
  
  // Minimal header
  doc.fillColor('#333')
     .fontSize(22)
     .font('Helvetica-Light')
     .text(personalInfo.fullName, 50, yPosition);
  
  yPosition += 30;
  
  doc.fontSize(10)
     .text(`${personalInfo.email}   ${personalInfo.phone || ''}`, 50, yPosition);
  
  yPosition += 40;
  
  // Minimalist sections with clean typography
  if (personalInfo.professionalSummary) {
    yPosition = addMinimalSection(doc, personalInfo.professionalSummary, yPosition, fontSize);
  }
  
  if (experience && experience.length > 0) {
    yPosition = addMinimalSectionHeader(doc, 'Experience', yPosition);
    experience.forEach(exp => {
      yPosition = addMinimalExperienceEntry(doc, exp, yPosition, fontSize);
    });
  }
  
  // Continue with minimal styling...
};

const generateCreativeTemplate = (doc, resume) => {
  const { personalInfo, experience, education, skills } = resume;
  const primaryColor = resume.settings.theme.primaryColor || '#e91e63';
  const secondaryColor = resume.settings.theme.secondaryColor || '#f8bbd9';
  const fontSize = resume.settings.theme.fontSize || 12;
  
  let yPosition = 50;
  
  // Creative header with geometric shapes
  doc.rect(0, 0, 200, doc.page.height)
     .fill(primaryColor);
  
  doc.circle(250, 80, 40)
     .fill(secondaryColor);
  
  // Name in sidebar
  doc.fillColor('white')
     .fontSize(18)
     .font('Helvetica-Bold')
     .text(personalInfo.fullName, 20, 100, { width: 160, align: 'center' });
  
  // Contact info in sidebar
  doc.fontSize(10)
     .text(personalInfo.email, 20, 140, { width: 160, align: 'center' })
     .text(personalInfo.phone || '', 20, 160, { width: 160, align: 'center' });
  
  // Main content area starts at x: 220
  yPosition = 70;
  
  if (personalInfo.professionalSummary) {
    yPosition = addCreativeSection(doc, 'About', personalInfo.professionalSummary, yPosition, 220, primaryColor, fontSize);
  }
  
  // Continue with creative styling...
};

// Helper functions for PDF generation
const addSection = (doc, title, content, yPosition, color, fontSize, font = 'Helvetica-Bold') => {
  checkPageBreak(doc, yPosition, 60);
  
  doc.fillColor(color)
     .fontSize(fontSize + 2)
     .font(font)
     .text(title, 50, yPosition);
  
  yPosition += 25;
  
  doc.fillColor('black')
     .fontSize(fontSize)
     .font('Helvetica')
     .text(content, 50, yPosition, { width: doc.page.width - 100, align: 'justify' });
  
  return yPosition + doc.heightOfString(content, { width: doc.page.width - 100 }) + 20;
};

const addSectionHeader = (doc, title, yPosition, color, fontSize, font = 'Helvetica-Bold') => {
  checkPageBreak(doc, yPosition, 40);
  
  doc.fillColor(color)
     .fontSize(fontSize + 2)
     .font(font)
     .text(title, 50, yPosition);
  
  // Add underline
  doc.moveTo(50, yPosition + 20)
     .lineTo(doc.page.width - 50, yPosition + 20)
     .stroke();
  
  return yPosition + 35;
};

const addExperienceEntry = (doc, exp, yPosition, fontSize, font = 'Helvetica') => {
  checkPageBreak(doc, yPosition, 80);
  
  // Job title and company
  doc.fillColor('black')
     .fontSize(fontSize + 1)
     .font('Helvetica-Bold')
     .text(`${exp.jobTitle} | ${exp.company}`, 50, yPosition);
  
  // Dates and location
  const endDate = exp.isCurrentJob ? 'Present' : (exp.endDate ? new Date(exp.endDate).toLocaleDateString() : '');
  const dateText = `${new Date(exp.startDate).toLocaleDateString()} - ${endDate}`;
  
  doc.fontSize(fontSize - 1)
     .font(font)
     .fillColor('#666')
     .text(dateText, 50, yPosition + 18);
  
  if (exp.location) {
    doc.text(exp.location, doc.page.width - 150, yPosition + 18, { width: 100, align: 'right' });
  }
  
  yPosition += 35;
  
  // Description
  if (exp.description) {
    doc.fillColor('black')
       .fontSize(fontSize)
       .font(font)
       .text(exp.description, 70, yPosition, { width: doc.page.width - 120 });
    
    yPosition += doc.heightOfString(exp.description, { width: doc.page.width - 120 }) + 10;
  }
  
  // Achievements
  if (exp.achievements && exp.achievements.length > 0) {
    exp.achievements.forEach(achievement => {
      doc.text(`• ${achievement}`, 70, yPosition, { width: doc.page.width - 120 });
      yPosition += doc.heightOfString(`• ${achievement}`, { width: doc.page.width - 120 }) + 5;
    });
  }
  
  return yPosition + 15;
};

const addEducationEntry = (doc, edu, yPosition, fontSize, font = 'Helvetica') => {
  checkPageBreak(doc, yPosition, 60);
  
  doc.fillColor('black')
     .fontSize(fontSize + 1)
     .font('Helvetica-Bold')
     .text(`${edu.degree} | ${edu.institution}`, 50, yPosition);
  
  if (edu.endDate || edu.isCurrentlyEnrolled) {
    const dateText = edu.isCurrentlyEnrolled ? 'Present' : new Date(edu.endDate).getFullYear();
    doc.fontSize(fontSize - 1)
       .font(font)
       .fillColor('#666')
       .text(dateText.toString(), doc.page.width - 100, yPosition, { width: 50, align: 'right' });
  }
  
  yPosition += 20;
  
  if (edu.gpa) {
    doc.text(`GPA: ${edu.gpa}`, 70, yPosition);
    yPosition += 15;
  }
  
  return yPosition + 10;
};

const addSkillsSection = (doc, skills, yPosition, color, fontSize) => {
  if (!skills.technical?.length && !skills.soft?.length && !skills.languages?.length) {
    return yPosition;
  }
  
  yPosition = addSectionHeader(doc, 'Skills', yPosition, color, fontSize);
  
  if (skills.technical?.length > 0) {
    doc.fillColor('black')
       .fontSize(fontSize)
       .font('Helvetica-Bold')
       .text('Technical Skills:', 50, yPosition);
    
    yPosition += 15;
    
    const technicalSkills = skills.technical.map(skill => skill.name).join(', ');
    doc.font('Helvetica')
       .text(technicalSkills, 70, yPosition, { width: doc.page.width - 120 });
    
    yPosition += doc.heightOfString(technicalSkills, { width: doc.page.width - 120 }) + 15;
  }
  
  if (skills.soft?.length > 0) {
    doc.font('Helvetica-Bold')
       .text('Soft Skills:', 50, yPosition);
    
    yPosition += 15;
    
    const softSkills = skills.soft.join(', ');
    doc.font('Helvetica')
       .text(softSkills, 70, yPosition, { width: doc.page.width - 120 });
    
    yPosition += doc.heightOfString(softSkills, { width: doc.page.width - 120 }) + 15;
  }
  
  return yPosition + 10;
};

const addProjectEntry = (doc, project, yPosition, fontSize) => {
  checkPageBreak(doc, yPosition, 60);
  
  doc.fillColor('black')
     .fontSize(fontSize + 1)
     .font('Helvetica-Bold')
     .text(project.name, 50, yPosition);
  
  yPosition += 20;
  
  if (project.description) {
    doc.fontSize(fontSize)
       .font('Helvetica')
       .text(project.description, 70, yPosition, { width: doc.page.width - 120 });
    
    yPosition += doc.heightOfString(project.description, { width: doc.page.width - 120 }) + 10;
  }
  
  if (project.technologies?.length > 0) {
    doc.fontSize(fontSize - 1)
       .fillColor('#666')
       .text(`Technologies: ${project.technologies.join(', ')}`, 70, yPosition);
    
    yPosition += 20;
  }
  
  return yPosition + 10;
};

const addCertificationEntry = (doc, cert, yPosition, fontSize) => {
  checkPageBreak(doc, yPosition, 40);
  
  doc.fillColor('black')
     .fontSize(fontSize)
     .font('Helvetica-Bold')
     .text(`${cert.name} - ${cert.issuer}`, 50, yPosition);
  
  if (cert.dateIssued) {
    const date = new Date(cert.dateIssued).getFullYear();
    doc.fontSize(fontSize - 1)
       .font('Helvetica')
       .fillColor('#666')
       .text(date.toString(), doc.page.width - 100, yPosition, { width: 50, align: 'right' });
  }
  
  return yPosition + 25;
};

const checkPageBreak = (doc, yPosition, requiredHeight) => {
  if (yPosition + requiredHeight > doc.page.height - 50) {
    doc.addPage();
    return 50;
  }
  return yPosition;
};

// Minimal template helpers
const addMinimalSection = (doc, content, yPosition, fontSize) => {
  doc.fillColor('#333')
     .fontSize(fontSize)
     .font('Helvetica')
     .text(content, 50, yPosition, { width: doc.page.width - 100, align: 'justify' });
  
  return yPosition + doc.heightOfString(content, { width: doc.page.width - 100 }) + 25;
};

const addMinimalSectionHeader = (doc, title, yPosition) => {
  doc.fillColor('#666')
     .fontSize(10)
     .font('Helvetica')
     .text(title.toUpperCase(), 50, yPosition);
  
  return yPosition + 25;
};

const addMinimalExperienceEntry = (doc, exp, yPosition, fontSize) => {
  doc.fillColor('#333')
     .fontSize(fontSize)
     .font('Helvetica-Bold')
     .text(`${exp.jobTitle}, ${exp.company}`, 50, yPosition);
  
  const endDate = exp.isCurrentJob ? 'Present' : (exp.endDate ? new Date(exp.endDate).getFullYear() : '');
  doc.fontSize(fontSize - 1)
     .font('Helvetica')
     .fillColor('#666')
     .text(`${new Date(exp.startDate).getFullYear()}-${endDate}`, doc.page.width - 100, yPosition, { width: 50, align: 'right' });
  
  yPosition += 20;
  
  if (exp.description) {
    doc.fillColor('#333')
       .fontSize(fontSize - 1)
       .text(exp.description, 50, yPosition, { width: doc.page.width - 100 });
    
    yPosition += doc.heightOfString(exp.description, { width: doc.page.width - 100 }) + 15;
  }
  
  return yPosition;
};

// Creative template helpers
const addCreativeSection = (doc, title, content, yPosition, xStart, color, fontSize) => {
  doc.fillColor(color)
     .fontSize(fontSize + 2)
     .font('Helvetica-Bold')
     .text(title, xStart, yPosition);
  
  yPosition += 25;
  
  doc.fillColor('black')
     .fontSize(fontSize)
     .font('Helvetica')
     .text(content, xStart, yPosition, { width: doc.page.width - xStart - 50 });
  
  return yPosition + doc.heightOfString(content, { width: doc.page.width - xStart - 50 }) + 20;
};

module.exports = {
  generatePDF,
  previewPDF
};