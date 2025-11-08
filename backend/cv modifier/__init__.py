"""
CV Modifier Module

This module provides functionality to mask sensitive information from CVs.
Supports PDF and DOCX file formats.
"""

# Make processor available at package level
from .processor import process_file

__all__ = ['process_file']
