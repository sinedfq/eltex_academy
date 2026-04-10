import { Component } from '@angular/core';
import { About } from "../about/about";
import { Career } from "./career/career";
import { Education } from "./education/education";
import { Courses } from "./courses/courses";
import { Skills } from './skills/skills';
import { Achievements } from './achievements/achievements';
import { Articles } from './articles/articles';
import { Hobby } from './hobby/hobby';

@Component({
  selector: 'app-main',
  imports: [About, Career, Education, Courses, Skills, Achievements, Articles, Hobby],
  templateUrl: './main.html',
  styleUrl: './main.scss',
})
export class MainComponent {}
