/**
 * 列出目录下的所有文件
 *
 * @author Zongmin Lei<leizongmin@gmail.com>
 */

import * as fs from "fs";

export type FindOneCallback = (
  filename: string,
  stats: fs.Stats,
  next: (err?: Error | null) => void
) => void;

export type FindFilter = RegExp | ((filename: string) => boolean);

/**
 * 遍历目录下的所有文件和目录
 */
export function each(dir: string, findOne: FindOneCallback): Promise<void>;

/**
 * 遍历目录下的所有文件
 */
export function eachFile(dir: string, findOne: FindOneCallback): Promise<void>;

/**
 * 遍历目录下的所有目录
 */
export function eachDir(dir: string, findOne: FindOneCallback): Promise<void>;

/**
 * 仅列出目录下指定规则的所有文件和目录
 */
export function eachFilter(
  dir: string,
  pattern: FindFilter,
  findOne: FindOneCallback
): Promise<void>;

/**
 * 仅列出目录下指定规则的所有文件
 */
export function eachFileFilter(
  dir: string,
  pattern: FindFilter,
  findOne: FindOneCallback
): Promise<void>;

/**
 * 仅列出目录下指定规则的所有目录
 */
export function eachDirFilter(
  dir: string,
  pattern: FindFilter,
  findOne: FindOneCallback
): Promise<void>;

/**
 * 列出目录下所有文件和目录
 */
export function read(dir: string): Promise<string[]>;

/**
 * 列出目录下所有文件
 */
export function readFile(dir: string): Promise<string[]>;

/**
 * 列出目录下所有目录
 */
export function readDir(dir: string): Promise<string[]>;

/**
 * 列出目录下指定规则的所有文件和目录
 */
export function readFilter(dir: string, pattern: FindFilter): Promise<string[]>;

/**
 * 列出目录下指定规则的所有文件
 */
export function readFileFilter(
  dir: string,
  pattern: FindFilter
): Promise<string[]>;

/**
 * 列出目录下指定规则的所有目录
 */
export function readDirFilter(
  dir: string,
  pattern: FindFilter
): Promise<string[]>;
